// Screen 5.2 — Resubmission Validation
// Route: /fix/validating
// Same UI as Screen 3.2 but with the amber resubmission note:
// "We'll check everything again — your other elements should still pass."
import ValidationRunning from '../../components/ValidationRunning'

export default function ResubmitValidating() {
  return <ValidationRunning isResubmission={true} />
}
