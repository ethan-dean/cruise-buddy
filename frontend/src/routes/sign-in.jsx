import { SignIn } from "@clerk/clerk-react"

export default function SignInPage() {

  return (
    <div className="sign-in-page-container">
      <SignIn path="/sign-in"/>
    </div>
  );
}