import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/layout/section';
import { Container } from '@/components/layout/container';
import { Navbar, NavbarBrand } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Chip } from '@/components/ui/chip';
import { MetricCard } from '@/components/shared/metric-card';
import { StatCard } from '@/components/shared/stat-card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { UsersIcon, DollarSignIcon } from 'lucide-react';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen pb-24">
      <Navbar>
        <NavbarBrand>Design System Showcase</NavbarBrand>
      </Navbar>
      
      <Container>
        <Section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Typography & Colors</h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-foreground">Heading 1</h1>
            <p className="text-muted-foreground">
              This is muted secondary text showing our primary body font (Geist) with a hint of radial glow behind it.
            </p>
          </div>
        </Section>

        <Section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Buttons & Interactive</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </Section>
        
        <Section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Cards & Glass</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard className="p-6" hoverable>
              <h3 className="mb-2 text-lg font-semibold">Glass Card (Hoverable)</h3>
              <p className="text-sm text-muted-foreground">Utilizes backdrop-blur and borders.</p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Glass Card (Static)</h3>
              <p className="text-sm text-muted-foreground">Beautiful frosted glass effect.</p>
            </GlassCard>
          </div>
        </Section>

        <Section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Metrics & Stats</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
              title="Total Revenue" 
              value="$12,345" 
              icon={<DollarSignIcon className="h-4 w-4" />} 
              trend={{ value: 12.5, label: "from last month" }} 
            />
            <StatCard 
              label="Active Tables" 
              value="14 / 20" 
              description="70% capacity"
              icon={<UsersIcon className="h-5 w-5" />} 
            />
          </div>
        </Section>

        <Section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Chips & Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
            <Chip>Default Chip</Chip>
            <Chip variant="secondary">Secondary Chip</Chip>
            <Chip variant="outline">Outline Chip</Chip>
          </div>
        </Section>

        <Section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Forms & Inputs</h2>
          <div className="max-w-md space-y-4">
            <Input placeholder="Enter something..." />
          </div>
        </Section>

        <Section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Loading States</h2>
          <div className="flex items-center gap-6">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="default" />
            <LoadingSpinner size="lg" />
            <LoadingSpinner size="xl" />
          </div>
        </Section>
      </Container>
    </div>
  );
}
