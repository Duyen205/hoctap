'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, AtSign, Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { authService } from '@/services/authService';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    if (!agreedToTerms) {
      setError('Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert('Đăng ký tài khoản thành công!');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Đóng"
          onClick={() => router.push('/login')}
        >
          <X size={15} />
        </button>

        <h1 className={styles.title}>Đăng ký</h1>
        <p className={styles.subtitle}>Tạo tài khoản của bạn. Miễn phí và chỉ mất một phút.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={`${styles.formGroup} ${styles.nameRow}`}>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><User size={15} /></span>
              <input
                type="text"
                placeholder="Tên"
                className={styles.input}
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><User size={15} /></span>
              <input
                type="text"
                placeholder="Họ"
                className={styles.input}
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><AtSign size={15} /></span>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                className={styles.input}
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><Mail size={15} /></span>
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><Lock size={15} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className={styles.input}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className={styles.inputToggle}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}><Lock size={15} /></span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                className={styles.input}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className={styles.inputToggle}
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <label className={styles.terms}>
            <input
              type="checkbox"
              className={styles.termsCheckbox}
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span>
              Tôi đồng ý với <a href="#" className={styles.link}>Điều khoản sử dụng</a> và{' '}
              <a href="#" className={styles.link}>Chính sách bảo mật</a>
            </span>
          </label>

          <div className={styles.actionRow}>
            <span className={styles.signInText}>
              Đã có tài khoản? <Link href="/login" className={styles.link}>Đăng nhập</Link>
            </span>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
            </button>
          </div>
        </form>

        <div className={styles.divider}>hoặc đăng ký bằng</div>

        <div className={styles.socialRow}>
          <button type="button" className={styles.socialBtn} title="Google">
            <img src="/google.png" alt="Google" className={styles.socialIcon} />
          </button>
          <button type="button" className={styles.socialBtn} title="Facebook">
            <img src="/fb.png" alt="Facebook" className={styles.socialIcon} />
          </button>
          <button type="button" className={styles.socialBtn} title="Apple">
            <img src="/ap.png" alt="Apple" className={styles.socialIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
