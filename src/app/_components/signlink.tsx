import Link from "next/link";
import { Button } from "./ui/button"
export function SigninLink() {
  return (
    <Button asChild>
      <Link href="/api/auth/signin">
        Sign in
      </Link>
    </Button>
  );
}