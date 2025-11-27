import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { generatePromptPayPayload, PROMPTPAY_PHONE } from "@/lib/promptpay";
import { Clock, QrCode, Smartphone, ArrowLeft, ArrowRight, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

const SHIPPING_FEE = 50;
const PAYMENT_TIMEOUT = 15 * 60; // 15 minutes in seconds

type Step = "address" | "payment";
type PaymentMethod = "promptpay" | "kbank";

interface AddressForm {
  name: string;
  phone: string;
  address: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("promptpay");
  const [addressForm, setAddressForm] = useState<AddressForm>({
    name: "",
    phone: "",
    address: ""
  });
  const [timeRemaining, setTimeRemaining] = useState(PAYMENT_TIMEOUT);
  const [isExpired, setIsExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const grandTotal = cartTotal + SHIPPING_FEE;

  // Countdown timer
  useEffect(() => {
    if (step !== "payment" || isExpired) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, isExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setStep("payment");
    setTimeRemaining(PAYMENT_TIMEOUT);
    setIsExpired(false);
  };

  const handleRefreshOrder = () => {
    setTimeRemaining(PAYMENT_TIMEOUT);
    setIsExpired(false);
  };

  const handleConfirmPayment = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      // Generate order number
      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: "paid",
          payment_method: paymentMethod,
          subtotal: cartTotal,
          shipping_fee: SHIPPING_FEE,
          total: grandTotal,
          customer_name: addressForm.name,
          customer_phone: addressForm.phone,
          shipping_address: addressForm.address,
          paid_at: new Date().toISOString()
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Navigate to success page
      navigate(`/order-success?order=${orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const openKBankApp = () => {
    // Try to open K PLUS app
    window.location.href = "kplus://";
    
    // Fallback message after a delay
    setTimeout(() => {
      toast({
        title: "K PLUS App",
        description: "If the app didn't open, please scan the QR code or transfer manually",
      });
    }, 2000);
  };

  // Generate PromptPay QR payload
  const promptPayPayload = generatePromptPayPayload(PROMPTPAY_PHONE, grandTotal);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === "address" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "address" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                1
              </div>
              <span className="font-medium hidden sm:inline">Address</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                2
              </div>
              <span className="font-medium hidden sm:inline">Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "address" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                    <CardDescription>Enter your delivery information</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleAddressSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="e.g., 081-234-5678"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Shipping Address *</Label>
                        <Input
                          id="address"
                          value={addressForm.address}
                          onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                          placeholder="Enter your full address"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => navigate("/cart")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Cart
                      </Button>
                      <Button type="submit">
                        Continue to Payment
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Choose your preferred payment method</CardDescription>
                    
                    {/* Countdown Timer */}
                    <div className={`flex items-center gap-2 mt-4 p-3 rounded-lg ${isExpired ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">
                        {isExpired 
                          ? "Session Expired" 
                          : `Time remaining to pay: ${formatTime(timeRemaining)}`
                        }
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isExpired ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Payment Session Expired</h3>
                        <p className="text-muted-foreground mb-4">
                          Your payment session has timed out. Please refresh to continue.
                        </p>
                        <Button onClick={handleRefreshOrder}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Order
                        </Button>
                      </div>
                    ) : (
                      <>
                        <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                          <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                            <RadioGroupItem value="promptpay" id="promptpay" />
                            <Label htmlFor="promptpay" className="flex items-center gap-2 cursor-pointer flex-1">
                              <QrCode className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">QR Payment / PromptPay</p>
                                <p className="text-sm text-muted-foreground">Scan QR code with any banking app</p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                            <RadioGroupItem value="kbank" id="kbank" />
                            <Label htmlFor="kbank" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Smartphone className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium">Mobile Banking (KBank)</p>
                                <p className="text-sm text-muted-foreground">Open K PLUS app directly</p>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>

                        {/* Payment Details */}
                        <Separator />

                        {paymentMethod === "promptpay" && (
                          <div className="text-center space-y-4">
                            <h3 className="font-semibold">Scan QR Code to Pay</h3>
                            <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                              <QRCodeSVG 
                                value={promptPayPayload} 
                                size={200}
                                level="M"
                              />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">PromptPay: {PROMPTPAY_PHONE}</p>
                              <p className="text-lg font-bold text-primary">฿{grandTotal.toLocaleString()}</p>
                            </div>
                          </div>
                        )}

                        {paymentMethod === "kbank" && (
                          <div className="text-center space-y-4">
                            <h3 className="font-semibold">KBank Mobile Banking</h3>
                            <Button 
                              size="lg" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={openKBankApp}
                            >
                              <Smartphone className="h-5 w-5 mr-2" />
                              Open K PLUS App
                            </Button>
                            <p className="text-sm text-muted-foreground">
                              Or scan the QR code above with K PLUS
                            </p>
                            <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                              <QRCodeSVG 
                                value={promptPayPayload} 
                                size={150}
                                level="M"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                  {!isExpired && (
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep("address")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button 
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Payment
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items List */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          ฿{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>฿{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>฿{SHIPPING_FEE.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">฿{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
