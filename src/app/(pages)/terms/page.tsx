export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Please read these terms carefully before using our services.
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using TechMart's website and services, you accept and agree to be bound 
                by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily download one copy of the materials on TechMart's 
                website for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
              <p className="text-muted-foreground mb-4">
                We strive to provide accurate product information, but we do not warrant that product 
                descriptions or other content is accurate, complete, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
              <p className="text-muted-foreground mb-4">
                All prices are subject to change without notice. Payment must be received before 
                products are shipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
              <p className="text-muted-foreground mb-4">
                We offer a 30-day return policy for most items. Refunds will be processed within 
                5-10 business days after we receive the returned item.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall TechMart or its suppliers be liable for any damages arising out of 
                the use or inability to use the materials on TechMart's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at 
                <a href="mailto:legal@techmart.com" className="text-primary hover:underline"> legal@techmart.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
