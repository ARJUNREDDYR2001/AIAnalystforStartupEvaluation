import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            For inquiries, support, or feedback, please reach out to our team members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-full">
              <User className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Arjun</h3>
              <div className="text-muted-foreground space-y-1 mt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>9380724044</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>Brodridge Fintech</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-full">
              <User className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Aditi</h3>
              <div className="text-muted-foreground space-y-1 mt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>9480479404</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>Capgemini</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
