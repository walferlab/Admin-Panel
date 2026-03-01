import { SignIn } from '@clerk/nextjs'
import { AuthFrame } from '@/components/auth/AuthFrame'

export default function SignInPage() {
  return (
    <AuthFrame title="PDF Lovers" subtitle="Admin sign in">
      <SignIn
        path="/sign-in"
        routing="path"
        appearance={{
          variables: {
            colorPrimary: '#d9763b',
            colorBackground: '#151922',
            colorInputBackground: '#1a1f2a',
            colorInputText: '#f2f4f8',
            colorText: '#f2f4f8',
            borderRadius: '6px',
          },
        }}
      />
    </AuthFrame>
  )
}
