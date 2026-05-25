import Script from "next/script";
import AppointmentSection from "@/components/shared/AppointmentSection";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function SiteLayout({
  children,
  showAppointment = false,
}) {
  return (
    <>
      <SiteHeader />
      <main id="top">{children}</main>
      {showAppointment ? <AppointmentSection /> : null}
      <SiteFooter />

      <Script src="/legacy/script.js" strategy="afterInteractive" />
    </>
  );
}
