import { useState } from "react";
import styles from "../style/login.module.css";
import { Link } from "react-router";
import { GoogleIcon } from "../components/icon/google";
import { GithubIcon } from "../components/icon/github";

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
        <div className={styles.socialButtons} style={{ marginTop: "1rem" }}>
          <button type="button" className={styles.socialButton}>
            <GoogleIcon
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
            />
            Google
          </button>
          <button type="button" className={styles.socialButton}>
            <GithubIcon
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
            />
            GitHub
          </button>
        </div>
      </div>

      {/* Register link */}
      <p className={styles.authSwitch}>
        Already have an account?{" "}
        <Link to="/register" className={styles.registerLink}>
          Register here
        </Link>
      </p>
    </div>
  );
}
