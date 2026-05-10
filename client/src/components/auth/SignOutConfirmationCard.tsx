import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export default function SignOutConfirmationcard(props: { setOpen: (open: boolean) => void; signOut: () => void }) {
  const { setOpen, signOut } = props;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 z-49 backdrop-blur-sm" onClick={() => setOpen(false)}/>
      <Card className="relative max-w-md rounded-2xl shadow-2xl border z-50">
        <CardHeader>
          <CardTitle>Sign Out</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You will be logged out of your account.</p>
        </CardContent>
        <CardFooter className="gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => { setOpen(false); signOut(); }}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}