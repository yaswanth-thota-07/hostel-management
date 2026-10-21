import LoginSection from "../components/LoginSection.jsx";
import Footer from "../components/Footer.jsx";

export default function LandingPage() {
  return (
    <div className="page">
      <div className="canvas landing-canvas">
        <main className="landing-main">
          <LoginSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
