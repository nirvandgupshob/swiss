import { auth } from "../../server/auth";
import { SigninLink } from "./signlink";

export async function MyApp({
    children,
  }: Readonly<{ children: React.ReactNode }>) {  
    const session = await auth();
  
    return (
      <div>
        {!session && <SigninLink />}
        <main>
          { session ? children : "Not signed in" }
        </main>
      </div>  
    );
  }