import { Button, Card, Input, Label, Spinner, Table } from "@heroui/react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useGetUsers } from "../hooks/useUsers";

export default function LoginPage() {
  const { data: coordinators, isLoading } = useGetUsers();
  const { mutate: login, isPending } = useLogin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!email.trim() || !password) {
      alert("Enter both your email and password.");
      return;
    }

    login({ email: email.trim(), password });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-2">
        <section className="px-20 py-12">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-400">
              Your coordination team
            </p>
            <Card className="overflow-hidden border border-slate-800 bg-slate-900/70">
              {isLoading ? (
                <div className="flex justify-center px-4 py-8">
                  <Spinner />
                </div>
              ) : (
                <Table aria-label="Available coordinators">
                  <Table.Content>
                    <Table.Header>
                      <Table.Column id="email">Email</Table.Column>
                      <Table.Column id="password">Password</Table.Column>
                    </Table.Header>
                    <Table.Body items={coordinators ?? []}>
                      {(coordinator) => (
                        <Table.Row id={coordinator.id}>
                          <Table.Cell>{coordinator.email}</Table.Cell>
                          <Table.Cell>123456</Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table>
              )}
            </Card>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-6 py-12 text-slate-900 sm:px-12">
          <Card className="w-full max-w-md border border-slate-200 bg-white shadow-xl">
            <Card.Header className="gap-2 p-8 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
                Welcome back
              </p>
              <Card.Title className="text-3xl">Sign in</Card.Title>
              <Card.Description>
                Use your coordinator account to continue.
              </Card.Description>
            </Card.Header>
            <Card.Content className="p-8 pt-0 space-y-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="input-type-email" className="w-30">Email</Label>
                <Input
                  id="input-type-email"
                  name="email"
                  placeholder="you@company.com"
                  type="email"
                  disabled={isPending}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="input-type-password">Password</Label>
                <Input
                  id="input-type-password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  disabled={isPending}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <Button
                fullWidth
                size="lg"
                isDisabled={isPending}
                onPress={handleSubmit}
                className="mt-2"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </Card.Content>
          </Card>
        </section>
      </div>
    </main>
  );
}