import { SignUp } from "@clerk/clerk-react"

export default function SignUpPage() {
  return (
    <div className="sign-up-page-container">
      <SignUp path="/sign-up" />
    </div>
  );
}