import { useT } from "@/components/shared/I18nProvider";

export default function AppointmentSection() {
  const t = useT();

  return (
    <section className="appointment-section" id="contact">
      <div className="wrap appointment-grid">
        <div className="appointment-copy reveal-left">
          <p className="section-label">{t("Any concern?")}</p>
          <h2 className="section-heading">{t("Visit our doctors, make an appointment")}</h2>

          <div className="contact-cards">
            <a className="contact-card" href="mailto:ashu.jain@jainpainclinic.com">
              <span className="contact-card__icon">
                <i className="fa-regular fa-envelope" aria-hidden="true"></i>
              </span>
              <span className="contact-card__content">
                <strong>{t("Email us")}</strong>
                <span>ashu.jain@jainpainclinic.com</span>
              </span>
            </a>

            <a className="contact-card" href="tel:+919211281009">
              <span className="contact-card__icon">
                <i className="fa-solid fa-phone" aria-hidden="true"></i>
              </span>
              <span className="contact-card__content">
                <strong>{t("Call us")}</strong>
                <span>+91 8130 640 351</span>
              </span>
            </a>
          </div>
        </div>

        <form className="appointment-form reveal-right" action="https://api.web3forms.com/submit" method="POST" noValidate>
          <input type="hidden" name="access_key" value="0047711e-3f37-4514-bf81-b251836688e1" />
          <input type="hidden" name="subject" value="New Appointment Request - Jain Pain Clinic" />
          <input type="hidden" name="from_name" value="Jain Pain Clinic Website" />
          <input type="checkbox" name="botcheck" style={{ display: "none" }} />

          <div className="form-row">
            <label>
              <span>{t("Your name")}</span>
              <input type="text" name="name" placeholder={t("Your name")} />
            </label>
            <label>
              <span>{t("Email")}</span>
              <input type="email" name="email" placeholder={t("Email")} />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>{t("Whatsapp no.")}</span>
              <input type="tel" name="whatsapp" placeholder={t("Whatsapp no.")} />
            </label>
            <label>
              <span>{t("Location")}</span>
              <input type="text" name="location" placeholder={t("Location")} />
            </label>
          </div>

          <label className="form-field form-field--full">
            <span>{t("Describe your problem")}</span>
            <textarea name="message" placeholder={t("Describe your problem...")}></textarea>
          </label>

          <button className="pill-button appointment-submit" type="submit">
            {t("Book appointment")}
          </button>
        </form>
      </div>
    </section>
  );
}
