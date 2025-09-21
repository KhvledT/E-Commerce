export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions and get the support you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How do I track my order?</h4>
                <p className="text-sm text-muted-foreground">
                  You can track your order by logging into your account and visiting the "My Orders" page.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What is your return policy?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day return policy for most items in original condition.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">How do I change my password?</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your profile settings and click on "Change Password" to update your password.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a href="/contact" className="block p-3 bg-background rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium">Contact Support</div>
                <div className="text-sm text-muted-foreground">Get help from our support team</div>
              </a>
              <a href="/track" className="block p-3 bg-background rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium">Track Order</div>
                <div className="text-sm text-muted-foreground">Check the status of your order</div>
              </a>
              <a href="/returns" className="block p-3 bg-background rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium">Start Return</div>
                <div className="text-sm text-muted-foreground">Initiate a return or exchange</div>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Still Need Help?</h2>
          <p className="text-muted-foreground text-center mb-6">
            Our customer support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-center">
              Contact Support
            </a>
            <a href="mailto:support@techmart.com" className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-center">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
