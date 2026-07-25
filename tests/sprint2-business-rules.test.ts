// =============================================================================
// RestaurantOS: Sprint 2 Business Rules Unit Test Suite (Node.js Native Test Engine)
// Testing: Table Session Generation, FSM Transitions, Reservation Double-Booking Prevention, Zod Boundaries
// Execution: npx tsx --test tests/sprint2-business-rules.test.ts
// =============================================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTableSessionToken, evaluateTableStateTransition, evaluateReservationTimeConflict, DomainError } from '../services';
import { createReservationSchema, validateQrSessionSchema, createMenuItemSchema } from '../validations';
import { handleActionError } from '../actions/utils';

test('🟢 Suite 1: Table Session Generation & QR Business Rules', async (t) => {
  await t.test('generateTableSessionToken: creates unique, prefixed session string', () => {
    const token1 = generateTableSessionToken(4);
    const token2 = generateTableSessionToken(4);

    assert.ok(token1.startsWith('table_4_sess_'), 'Token must start with correct table prefix');
    assert.notEqual(token1, token2, 'Generated table QR session tokens must be completely unique');
    assert.ok(token1.length > 20, 'Token length must contain robust random hexadecimal string');
  });

  await t.test('evaluateTableStateTransition: allows valid sequential dining floor transitions', () => {
    // Should execute silently without throwing against VALID_TABLE_TRANSITIONS matrix
    evaluateTableStateTransition('AVAILABLE', 'RESERVED');
    evaluateTableStateTransition('RESERVED', 'SEATED');
    evaluateTableStateTransition('AVAILABLE', 'SEATED');
    evaluateTableStateTransition('SEATED', 'DIRTY');
    evaluateTableStateTransition('DIRTY', 'AVAILABLE');
  });

  await t.test('evaluateTableStateTransition: blocks illegal state jumps with STATE_CONFLICT exception', () => {
    assert.throws(
      () => evaluateTableStateTransition('SEATED', 'AVAILABLE'),
      (err: unknown) => {
        assert.ok(err instanceof DomainError);
        assert.equal((err as DomainError).code, 'STATE_CONFLICT');
        assert.ok((err as DomainError).message.includes('Illegal table operational transition'));
        return true;
      },
      'Jumping directly from SEATED to AVAILABLE without table checkout/cleanup must be strictly forbidden'
    );
  });
});

test('🟡 Suite 2: Reservation Double-Booking & Conflict Detection Rules', async (t) => {
  const mockBookings = [
    {
      guest_name: 'VIP Elon Musk',
      reservation_time: '2026-07-25T19:00:00.000Z',
      status: 'CONFIRMED' as const,
    },
    {
      guest_name: 'Cancelled Party',
      reservation_time: '2026-07-25T20:00:00.000Z',
      status: 'CANCELLED' as const,
    },
  ];

  await t.test('evaluateReservationTimeConflict: detects overlapping double-booking within 90 min window', () => {
    // Attempt booking at 19:45 (overlaps 19:00-20:30 window)
    const result = evaluateReservationTimeConflict(mockBookings, '2026-07-25T19:45:00.000Z', 90);
    assert.equal(result.hasConflict, true, 'Should flag overlap as a double-booking conflict');
    assert.ok(result.conflictingBooking?.includes('VIP Elon Musk'), 'Must identify the conflicting guest booking');
  });

  await t.test('evaluateReservationTimeConflict: permits non-overlapping consecutive reservation slots', () => {
    // Attempt booking at 21:00 (after 19:00-20:30 window terminates)
    const result = evaluateReservationTimeConflict(mockBookings, '2026-07-25T21:00:00.000Z', 90);
    assert.equal(result.hasConflict, false, 'Should allow clean reservation outside existing dining windows');
  });

  await t.test('evaluateReservationTimeConflict: ignores inactive/cancelled bookings without triggering false conflicts', () => {
    // 20:00 booking was CANCELLED; checking 20:30 slot should not collide with cancelled record
    const result = evaluateReservationTimeConflict(mockBookings, '2026-07-25T20:30:00.000Z', 90);
    assert.equal(result.hasConflict, false, 'Cancelled reservations must not obstruct future bookings');
  });
});

test('🔵 Suite 3: Zod Validation Boundary & Consistent Server Action Error Formatting', async (t) => {
  await t.test('createReservationSchema: rejects invalid guest capacity and malformed timestamps', () => {
    const invalidPayload = {
      guest_name: 'J',
      phone: '123',
      guest_count: -2,
      reservation_time: 'Tomorrow 7pm',
    };

    const result = createReservationSchema.safeParse(invalidPayload);
    assert.equal(result.success, false, 'Schema validation must fail on malformed inputs');
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.guest_count, 'Must report guest count validation failure');
      assert.ok(result.error.flatten().fieldErrors.reservation_time, 'Must report datetime timestamp validation failure');
    }
  });

  await t.test('createMenuItemSchema: enforces strictly positive integer cents pricing', () => {
    const floatPricePayload = {
      category_id: '11111111-1111-4111-8111-111111111111',
      name: 'Truffle Fries',
      price_cents: 14.50, // Float decimal violation!
      prep_time_minutes: 10,
    };

    const result = createMenuItemSchema.safeParse(floatPricePayload);
    assert.equal(result.success, false, 'Decimal floats must be rejected in favor of integer cents');
  });

  await t.test('handleActionError: transforms Zod runtime faults into structural ActionResponse error envelopes', () => {
    const zodResult = validateQrSessionSchema.safeParse({ table_id: 'bad-uuid', token: 'sh' });
    assert.equal(zodResult.success, false);
    
    if (!zodResult.success) {
      const actionResp = handleActionError(zodResult.error);
      assert.equal(actionResp.success, false);
      if (!actionResp.success) {
        assert.equal(actionResp.error.code, 'VALIDATION_ERROR', 'Action response must standardize error code');
        assert.ok(actionResp.error.fieldErrors?.table_id, 'Action error envelope must expose mapped field errors');
      }
    }
  });
});
