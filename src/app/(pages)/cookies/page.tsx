export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">
            Learn about how we use cookies to improve your experience on our website.
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device when you 
                visit our website. They help us provide you with a better experience by remembering your 
                preferences and improving our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies for several purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Essential cookies: Required for the website to function properly</li>
                <li>Performance cookies: Help us understand how visitors use our website</li>
                <li>Functionality cookies: Remember your preferences and choices</li>
                <li>Marketing cookies: Used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                <li>Cookie preferences: Use our cookie preference center to manage your choices</li>
                <li>Third-party opt-out: Visit the opt-out pages of relevant third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                We may also use third-party cookies from trusted partners to provide additional 
                functionality and analyze website usage. These cookies are subject to the privacy 
                policies of the respective third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our use of cookies, please contact us at 
                <a href="mailto:cookies@techmart.com" className="text-primary hover:underline"> cookies@techmart.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
