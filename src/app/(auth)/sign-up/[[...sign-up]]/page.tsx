import { SignUp } from '@clerk/nextjs'
import { AuthFrame } from '@/components/auth/AuthFrame'

export default function SignUpPage() {
  return (
    <AuthFrame title="PDF Lovers" subtitle="Create admin account">
      <SignUp
        path="/sign-up"
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
