// Issue #24: Implement contribution form
// Complexity: Trivial (100 pts)
// Status: Placeholder

import React, { useEffect, useRef, useState } from 'react'

interface ContributionFormProps {
  groupId: string
  contributionAmount: number
}

interface FormErrors {
  amount?: string
}

export const ContributionForm: React.FC<ContributionFormProps> = ({
  groupId,
  contributionAmount,
}) => {
  const [amount, setAmount] = useState(contributionAmount)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const errorSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (submitted && formErrors.amount && errorSummaryRef.current) {
      errorSummaryRef.current.focus()
    }
  }, [formErrors.amount, submitted])

  const validateAmount = (value: number): string | undefined => {
    if (!value && value !== 0) return 'Amount is required'
    if (value <= 0) return 'Amount must be greater than 0'
    if (value > 1000000) return 'Amount must not exceed 1,000,000'
    return undefined
  }

  const handleBlur = () => {
    setTouched(true)
    const amountError = validateAmount(amount)
    setFormErrors({ amount: amountError })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setAmount(value)

    if (touched) {
      const amountError = validateAmount(value)
      setFormErrors({ amount: amountError })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched(true)

    const amountError = validateAmount(amount)
    setFormErrors({ amount: amountError })

    if (amountError) {
      errorSummaryRef.current?.focus()
      return
    }

    setLoading(true)
    try {
      console.log('Contributing to group:', groupId, 'Amount:', amount)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAmount(contributionAmount)
      setError('')
    } catch (submitError) {
      setError('Failed to contribute. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const networkFee = 0.01
  const total = amount + networkFee
  const hasError = !!formErrors.amount

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-2">Make a Contribution</h1>
      <p className="text-sm text-gray-600 mb-6">
        Enter the amount you&apos;d like to contribute to this group. Fields marked
        with <span className="text-red-600 font-semibold">*</span> are required.
      </p>

      {hasError && (
        <div
          ref={errorSummaryRef}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          tabIndex={-1}
        >
          <h2 className="text-sm font-semibold text-red-800 mb-2">
            Please fix this error:
          </h2>
          <ul className="text-sm text-red-700 space-y-1">
            {formErrors.amount && (
              <li>
                <a
                  href="#amount"
                  className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-600 rounded px-1"
                >
                  {formErrors.amount}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm font-medium"
        >
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold mb-2">
            Amount to Contribute ($){' '}
            <span className="text-red-600 font-semibold" aria-label="required">
              *
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-600" aria-hidden="true">
              $
            </span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleChange}
              onBlur={handleBlur}
              step="0.01"
              min="0"
              max="1000000"
              className={`w-full pl-8 pr-4 py-2 border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                touched && hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              aria-required="true"
              aria-describedby={`amount-help${touched && hasError ? ' amount-error' : ''}`}
              required
            />
          </div>
          <p id="amount-help" className="mt-2 text-xs text-gray-600">
            Enter the amount you want to contribute (0.01 - 1,000,000)
          </p>
          {touched && hasError && (
            <p id="amount-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
              ⚠️ {formErrors.amount}
            </p>
          )}
        </div>

        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          aria-live="polite"
          aria-label="Contribution summary"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Subtotal:</span>
            <span className="font-semibold text-gray-900">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Network Fee:</span>
            <span className="font-semibold text-gray-900">${networkFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-gray-900 font-semibold">Total:</span>
            <span className="text-lg font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label={loading ? 'Processing contribution, please wait' : 'Contribute'}
        >
          {loading ? 'Processing...' : 'Contribute'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          You&apos;ll be prompted to confirm this transaction in your wallet.
        </p>
      </form>
    </div>
  )
}
