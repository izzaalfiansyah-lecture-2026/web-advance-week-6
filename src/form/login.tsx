import { useState } from "react";
import styles from "../style/login.module.css";

const DEMO_EMAIL = "admin@demo.com";
const DEMO_PASSWORD = "admin";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  type FormData = typeof formData;

  const [errors, setErrors] = useState<Record<keyof FormData, string>>(
    {} as any,
  );
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>(
    {} as any,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleInputChange = (e: any) => {
    const { name, type, value, checked } = e.target;
    const fieldName = name as keyof FormData;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear submit feedback when user starts editing again
    if (submitStatus) {
      setSubmitStatus(null);
    }

    if (touched[fieldName]) {
      const fieldError = validateField(
        fieldName,
        type === "checkbox" ? checked : value,
      );
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    }
  };

  const handleBlur = (e: any) => {
    const { name, type, value, checked } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldError = validateField(
      name,
      type === "checkbox" ? checked : value,
    );
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const validateField = (field: keyof typeof formData, value: any) => {
    switch (field) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address (e.g., name@example.com)";
        }
        return "";
      case "password":
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<keyof FormData, string> = {} as any;
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitStatus(null);

    const allTouched: Record<keyof FormData, boolean> = {} as any;
    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors above before logging in.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);

      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        setSubmitStatus({
          type: "error",
          message:
            "Invalid email or password. Please check your credentials and try again.",
        });
        return;
      }

      setSubmitStatus({
        type: "success",
        message: "Login successful! Welcome back, Admin.",
      });
    }, 1500);
  };

  if (submitStatus?.type === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.successMessageFull}>
          <h3>🎉 Login Successful!</h3>
          <p style={{ margin: "0.5rem 0 1rem" }}>{submitStatus.message}</p>
          <button
            type="button"
            className={styles.submitButton}
            style={{ margin: 0 }}
            onClick={() => {
              setSubmitStatus(null);
              setFormData({ email: "", password: "", rememberMe: false });
              setTouched({} as any);
              setErrors({} as any);
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back</h1>
      <p className={styles.subtitle}>Sign in to your account to continue</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.email ? styles.error : ""}`}
            placeholder="your.email@example.com"
            autoComplete="email"
          />
          {errors.email && (
            <span style={{ color: "#e74c3c", fontSize: "0.8rem" }}>
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.password ? styles.error : ""}`}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {errors.password && (
            <span style={{ color: "#e74c3c", fontSize: "0.8rem" }}>
              {errors.password}
            </span>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className={styles.formActions}>
          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className={styles.checkbox}
            />
            <span className={styles.checkboxLabel}>Remember me</span>
          </label>

          <button type="button" className={styles.forgotLink}>
            Forgot password?
          </button>
        </div>

        {/* Form-level feedback */}
        {submitStatus && (
          <div className={styles.errorMessage}>{submitStatus.message}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Social login */}
      <div style={{ marginTop: "1.5rem" }}>
        <div className={styles.divider}>or continue with</div>
        <div
          className={styles.socialButtons}
          style={{ marginTop: "1rem" }}
        >
          <button type="button" className={styles.socialButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5 7.7.5 3.99 2.97 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.55 6.16-4.55z"
              />
            </svg>
            Google
          </button>
          <button type="button" className={styles.socialButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#24292f"
                d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.2-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.23a11.1 11.1 0 0 1 5.8 0c2.2-1.54 3.17-1.23 3.17-1.23.63 1.59.23 2.76.12 3.05.75.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.02 2.8-.02 3.18 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"
              />
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
