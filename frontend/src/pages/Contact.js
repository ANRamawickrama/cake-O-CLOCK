import React, { useState } from "react";
import { Link } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api, { apiErrorMessage } from "../services/api";
import { SITE } from "../helpers/site";
import "../styles/Contact.css";

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Cupcake box",
  "Jar cake",
  "Office / event",
  "Something else",
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom cake enquiry",
    occasion: "",
    guests: "",
    neededBy: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.message.trim()) {
      setError("Please add your name and tell us about the cake you need.");
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      setError("Please add an email address or phone number so we can reply.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/contact", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.neededBy
          ? `${form.message.trim()}\n\nNeeded by: ${form.neededBy}`
          : form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Failed to send your enquiry. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contactPage">
      <section className="contactHero">
        <div className="container contactHeroInner">
          <p className="eyebrow">Get in touch</p>
          <h1 className="contactTitle">
            Let's plan something <em>delicious</em>
          </h1>
          <p className="contactText">
            Tell us the occasion, the date and the number of guests. We reply to
            every enquiry — usually within a few hours.
          </p>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container contactLayout">
          <aside className="contactAside">
            <div className="contactCard">
              <h2 className="contactCardTitle">Reach us directly</h2>
              <ul className="contactList">
                <li>
                  <span className="contactListIcon">
                    <PhoneIcon fontSize="small" />
                  </span>
                  <div>
                    <span className="contactListLabel">Phone</span>
                    <a href={`tel:${SITE.phone}`} className="contactListValue">
                      {SITE.phoneDisplay}
                    </a>
                  </div>
                </li>
                <li>
                  <span className="contactListIcon">
                    <WhatsAppIcon fontSize="small" />
                  </span>
                  <div>
                    <span className="contactListLabel">WhatsApp</span>
                    <a
                      href={SITE.socials.whatsapp}
                      className="contactListValue"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Chat with us
                    </a>
                  </div>
                </li>
                <li>
                  <span className="contactListIcon">
                    <EmailIcon fontSize="small" />
                  </span>
                  <div>
                    <span className="contactListLabel">Email</span>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="contactListValue"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </li>
                <li>
                  <span className="contactListIcon">
                    <LocationOnIcon fontSize="small" />
                  </span>
                  <div>
                    <span className="contactListLabel">Studio</span>
                    <a
                      href={SITE.mapUrl}
                      className="contactListValue"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {SITE.address}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="contactCard">
              <h2 className="contactCardTitle">
                <AccessTimeIcon fontSize="small" />
                Opening hours
              </h2>
              <ul className="contactHours">
                {SITE.hours.map((slot) => (
                  <li key={slot.day}>
                    <span>{slot.day}</span>
                    <span>{slot.time}</span>
                  </li>
                ))}
              </ul>
              <p className="contactNote">
                Orders for the same day need at least 24 hours notice — call us
                to check availability.
              </p>
            </div>
          </aside>

          <div className="contactPanel">
            {sent ? (
              <div className="contactSent">
                <span className="contactSentIcon">
                  <CheckCircleIcon fontSize="large" />
                </span>
                <h2 className="contactSentTitle">Enquiry received</h2>
                <p className="contactSentText">
                  Thank you {form.name.split(" ")[0]}! Your enquiry is with our
                  kitchen team. We will get back to you on{" "}
                  {form.email || form.phone} shortly.
                </p>
                <div className="contactSentActions">
                  <Link to="/menu" className="btn btn-primary">
                    Browse the menu
                    <ArrowForwardIcon fontSize="small" />
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "Custom cake enquiry",
                        occasion: "",
                        guests: "",
                        neededBy: "",
                        message: "",
                      });
                    }}
                  >
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <header className="contactPanelHead">
                  <h2 className="contactPanelTitle">Request a custom cake</h2>
                  <p className="contactPanelSub">
                    Share a few details and our cake artists will come back with
                    a design and a quote.
                  </p>
                </header>

                {error && <div className="alert alert-error">{error}</div>}

                <form className="contactForm" onSubmit={handleSubmit}>
                  <div className="contactFormGrid">
                    <div className="field">
                      <label htmlFor="contact-name">Your name</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Jane Perera"
                        value={form.name}
                        onChange={updateField("name")}
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="contact-phone">Phone</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="077 000 0000"
                        value={form.phone}
                        onChange={updateField("phone")}
                      />
                    </div>
                  </div>

                  <div className="contactFormGrid">
                    <div className="field">
                      <label htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="jane@email.com"
                        value={form.email}
                        onChange={updateField("email")}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="contact-guests">Guests / servings</label>
                      <input
                        id="contact-guests"
                        type="text"
                        placeholder="40"
                        value={form.guests}
                        onChange={updateField("guests")}
                      />
                    </div>
                  </div>

                  <div className="contactFormGrid">
                    <div className="field">
                      <label htmlFor="contact-occasion">Occasion</label>
                      <select
                        id="contact-occasion"
                        value={form.occasion}
                        onChange={updateField("occasion")}
                      >
                        <option value="">Choose an occasion</option>
                        {OCCASIONS.map((occasion) => (
                          <option key={occasion} value={occasion}>
                            {occasion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label htmlFor="contact-subject">Subject</label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="Custom cake enquiry"
                        value={form.subject}
                        onChange={updateField("subject")}
                        maxLength={160}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="contact-date">Needed by</label>
                    <input
                      id="contact-date"
                      type="date"
                      value={form.neededBy}
                      onChange={updateField("neededBy")}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="contact-message">Tell us about it</label>
                    <textarea
                      id="contact-message"
                      rows="5"
                      placeholder="Flavours, colours, the message you want on the cake, and anything else we should know..."
                      value={form.message}
                      onChange={updateField("message")}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send enquiry"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
