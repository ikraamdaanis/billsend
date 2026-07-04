import { zodResolver } from "@hookform/resolvers/zod";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  cleanupOrphanedImages,
  getBusinessProfile,
  saveBusinessProfile,
  saveImage
} from "~/db";
import { useImageLoader } from "~/hooks/use-image-loader";
import { createDefaultBusinessProfile } from "~/schema/business-profile";

const businessProfileFormSchema = z.object({
  businessName: z
    .string()
    .max(200, "Business name must be less than 200 characters"),
  address: z.string().max(1000, "Address must be less than 1000 characters"),
  email: z.string().max(200, "Email must be less than 200 characters"),
  phone: z.string().max(100, "Phone must be less than 100 characters"),
  bankName: z.string().max(200, "Bank name must be less than 200 characters"),
  accountNumber: z
    .string()
    .max(100, "Account number must be less than 100 characters"),
  iban: z.string().max(100, "IBAN must be less than 100 characters"),
  sortCode: z.string().max(100, "Sort code must be less than 100 characters"),
  paymentTerms: z
    .string()
    .max(1000, "Payment instructions must be less than 1000 characters")
});

export function BusinessProfileDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [logoImageId, setLogoImageId] = useState("");

  const form = useForm<z.infer<typeof businessProfileFormSchema>>({
    resolver: zodResolver(businessProfileFormSchema),
    defaultValues: {
      businessName: "",
      address: "",
      email: "",
      phone: "",
      bankName: "",
      accountNumber: "",
      iban: "",
      sortCode: "",
      paymentTerms: ""
    }
  });

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadProfile() {
      try {
        const profile = await getBusinessProfile();

        if (cancelled) return;

        form.reset({
          businessName: profile.businessName,
          address: profile.address,
          email: profile.email,
          phone: profile.phone,
          bankName: profile.paymentDetails.bankName,
          accountNumber: profile.paymentDetails.accountNumber,
          iban: profile.paymentDetails.iban,
          sortCode: profile.paymentDetails.sortCode,
          paymentTerms: profile.paymentDetails.terms
        });
        setLogoImageId(profile.logoImageId);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load business profile."
        );
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [open, form]);

  function handleSubmit(data: z.infer<typeof businessProfileFormSchema>) {
    startTransition(async () => {
      try {
        await saveBusinessProfile({
          ...createDefaultBusinessProfile(),
          businessName: data.businessName.trim(),
          address: data.address.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          logoImageId,
          paymentDetails: {
            bankName: data.bankName.trim(),
            accountNumber: data.accountNumber.trim(),
            iban: data.iban.trim(),
            sortCode: data.sortCode.trim(),
            terms: data.paymentTerms.trim()
          }
        });
        void cleanupOrphanedImages([logoImageId]);
        toast.success("Business profile saved");
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save business profile."
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[540px]">
        <DialogHeader>
          <DialogTitle>Business profile</DialogTitle>
          <DialogDescription>
            Your sender details and logo, saved once and pre-filled onto every
            new invoice. Editing them here never changes invoices you already
            saved.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 px-4 pb-4">
              <ProfileLogoField
                logoImageId={logoImageId}
                onChange={setLogoImageId}
              />
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"123 Main St.\nAnytown, USA 12345"}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="info@acmeinc.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 555-5555" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Payment details</p>
                <p className="text-muted-foreground text-xs">
                  Tell clients how to pay you. Pre-filled onto new invoices;
                  leave any field blank to omit it.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Bank" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account number</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="iban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBAN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="GB29 NWBK 6016 1331 9268 19"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort code</FormLabel>
                      <FormControl>
                        <Input placeholder="12-34-56" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"Net 30\nPayPal: pay@acmeinc.com"}
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ProfileLogoField({
  logoImageId,
  onChange
}: {
  logoImageId: string;
  onChange: (imageId: string) => void;
}) {
  const previewUrl = useImageLoader(logoImageId);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) return;

    const newImageId = crypto.randomUUID();

    try {
      await saveImage(newImageId, file, file.type);
      onChange(newImageId);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save logo."
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Logo</Label>
      <div className="flex items-center gap-4">
        <div className="rounded-surface flex aspect-square h-20 w-20 items-center justify-center overflow-hidden bg-zinc-100">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Business logo"
              width={80}
              height={80}
              className="rounded-surface h-20 w-20 object-cover"
            />
          ) : (
            <IconUpload className="h-6 w-6 text-zinc-500" aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            {previewUrl ? "Change logo" : "Upload logo"}
          </Button>
          {previewUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
            >
              Remove
            </Button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={event => handleFileChange(event.target.files)}
        />
      </div>
    </div>
  );
}
