import { zodResolver } from "@hookform/resolvers/zod";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import {
  createDefaultBusinessProfile,
  DEFAULT_INVOICE_NUMBERING
} from "~/schema/business-profile";
import { useInvoiceStore } from "~/stores/invoice-store";
import { formatInvoiceNumber } from "~/utils/invoice-numbering";

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
  bic: z.string().max(100, "BIC / SWIFT must be less than 100 characters"),
  sortCode: z.string().max(100, "Sort code must be less than 100 characters"),
  paymentTerms: z
    .string()
    .max(1000, "Payment instructions must be less than 1000 characters"),
  numberPrefix: z.string().max(20, "Prefix must be less than 20 characters"),
  numberPadding: z
    .number({ message: "Enter a number" })
    .int("Padding must be a whole number")
    .min(0, "Padding can't be negative")
    .max(10, "Padding must be 10 or less")
});

export function BusinessProfileDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  // Stays true from a successful save until the dialog is next opened, so the
  // button keeps its "Saving..." state through the close animation instead of
  // flashing back to "Save profile" the instant the transition settles.
  const [closingAfterSave, setClosingAfterSave] = useState(false);
  const [logoImageId, setLogoImageId] = useState("");
  // The live counter is preserved verbatim across saves: only the prefix and
  // padding are editable here, so editing the profile never rewinds numbering.
  const [nextNumber, setNextNumber] = useState(
    DEFAULT_INVOICE_NUMBERING.nextNumber
  );

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
      bic: "",
      sortCode: "",
      paymentTerms: "",
      numberPrefix: DEFAULT_INVOICE_NUMBERING.prefix,
      numberPadding: DEFAULT_INVOICE_NUMBERING.padding
    }
  });

  useEffect(() => {
    if (!open) return;

    setClosingAfterSave(false);

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
          bic: profile.paymentDetails.bic,
          sortCode: profile.paymentDetails.sortCode,
          paymentTerms: profile.paymentDetails.terms,
          numberPrefix: profile.numbering.prefix,
          numberPadding: profile.numbering.padding
        });
        setLogoImageId(profile.logoImageId);
        setNextNumber(profile.numbering.nextNumber);
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
            bic: data.bic.trim(),
            sortCode: data.sortCode.trim(),
            terms: data.paymentTerms.trim()
          },
          numbering: {
            prefix: data.numberPrefix,
            padding: data.numberPadding,
            nextNumber
          }
        });
        // Keep both the profile logo and the image the live invoice currently
        // uses: an unsaved invoice's logo isn't referenced by any stored
        // document yet, so without this the sweep would delete the blob out
        // from under the invoice being edited.
        const liveInvoiceImageId = useInvoiceStore.getState().image;
        void cleanupOrphanedImages([logoImageId, liveInvoiceImageId]);
        toast.success("Business profile saved");
        setClosingAfterSave(true);
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

  function handleClearAll() {
    form.reset({
      businessName: "",
      address: "",
      email: "",
      phone: "",
      bankName: "",
      accountNumber: "",
      iban: "",
      bic: "",
      sortCode: "",
      paymentTerms: "",
      numberPrefix: "",
      numberPadding: 0
    });
    setLogoImageId("");
  }

  const numberPrefix = useWatch({
    control: form.control,
    name: "numberPrefix"
  });
  const numberPadding = useWatch({
    control: form.control,
    name: "numberPadding"
  });
  const previewNumber = formatInvoiceNumber({
    prefix: numberPrefix,
    padding: Number.isFinite(numberPadding) ? numberPadding : 0,
    nextNumber
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden sm:max-w-xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Business profile</DialogTitle>
          <DialogDescription>
            Your sender details and logo, saved once and pre-filled onto every
            new invoice. Editing them here never changes invoices you already
            saved.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  name="bic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BIC / SWIFT</FormLabel>
                      <FormControl>
                        <Input placeholder="NWBKGB2L" {...field} />
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
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Invoice numbering</p>
                <p className="text-muted-foreground text-xs">
                  New invoices are numbered automatically from a running
                  counter. You can still override the number on any single
                  invoice.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="numberPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix</FormLabel>
                      <FormControl>
                        <Input placeholder="INV-" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberPadding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zero-padding</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={
                            Number.isFinite(field.value) ? field.value : ""
                          }
                          onChange={event =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Next invoice:{" "}
                <span className="text-foreground font-medium">
                  {previewNumber}
                </span>
              </p>
            </div>
            <DialogFooter className="shrink-0">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearAll}
                disabled={pending}
                className="text-muted-foreground sm:mr-auto"
              >
                Clear all
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending || closingAfterSave}>
                Save profile
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
