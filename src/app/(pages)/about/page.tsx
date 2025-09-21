export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About TechMart</h1>
          <p className="text-muted-foreground text-lg">
            Your trusted partner in technology and lifestyle products
          </p>
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Founded in 2020, TechMart has been at the forefront of providing cutting-edge technology 
              and lifestyle products to customers worldwide. We believe in making quality products 
              accessible to everyone while maintaining the highest standards of customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide the best technology and lifestyle products with exceptional customer service.
              </p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">👁️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-muted-foreground">
                To become the world&apos;s most trusted e-commerce platform for technology products.
              </p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Values</h3>
              <p className="text-muted-foreground">
                Quality, innovation, customer satisfaction, and continuous improvement.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6 text-center">Why Choose TechMart?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Quality Products</h3>
                    <p className="text-muted-foreground text-sm">We only sell products that meet our high quality standards.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Fast Shipping</h3>
                    <p className="text-muted-foreground text-sm">Free shipping on orders over $50 with fast delivery.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium">24/7 Support</h3>
                    <p className="text-muted-foreground text-sm">Our customer support team is always ready to help.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Payment</h3>
                    <p className="text-muted-foreground text-sm">Your payment information is protected with industry-standard security.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Easy Returns</h3>
                    <p className="text-muted-foreground text-sm">30-day return policy with hassle-free returns.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Best Prices</h3>
                    <p className="text-muted-foreground text-sm">Competitive pricing with regular deals and discounts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
