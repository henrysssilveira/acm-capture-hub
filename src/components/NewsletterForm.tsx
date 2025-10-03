import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Por favor, insira um email válido" })
    .max(255, { message: "Email muito longo" }),
  company: z
    .string()
    .trim()
    .min(1, { message: "Nome da empresa é obrigatório" })
    .max(100, { message: "Nome da empresa muito longo" }),
  phone: z
    .string()
    .trim()
    .min(8, { message: "Telefone inválido" })
    .max(20, { message: "Telefone muito longo" }),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const NewsletterForm = () => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: "",
    company: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewsletterFormData, string>>>({});

  const handleChange = (field: keyof NewsletterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = newsletterSchema.parse(formData);

      // Insert into database
      const { error: dbError } = await supabase
        .from('newsletter_contacts')
        .insert({
          email: validatedData.email,
          company: validatedData.company,
          phone: validatedData.phone
        });

      if (dbError) {
        // Check for duplicate email
        if (dbError.code === '23505') {
          toast.error("Este email já está cadastrado!");
        } else {
          console.error("Database error:", dbError);
          toast.error("Erro ao realizar cadastro. Tente novamente.");
        }
        return;
      }

      toast.success("Cadastro realizado com sucesso! Entraremos em contato em breve.");
      
      // Reset form
      setFormData({ email: "", company: "", phone: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof NewsletterFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof NewsletterFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Por favor, corrija os erros no formulário");
      } else {
        toast.error("Erro ao realizar cadastro. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleChange("email")}
          className="bg-input border-border focus:ring-primary transition-all"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="text-foreground font-medium">
          Nome da Empresa
        </Label>
        <Input
          id="company"
          type="text"
          placeholder="Sua empresa"
          value={formData.company}
          onChange={handleChange("company")}
          className="bg-input border-border focus:ring-primary transition-all"
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? "company-error" : undefined}
        />
        {errors.company && (
          <p id="company-error" className="text-sm text-destructive">
            {errors.company}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-medium">
          Telefone de Contato
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={handleChange("phone")}
          className="bg-input border-border focus:ring-primary transition-all"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-destructive">
            {errors.phone}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-gradient-to-r from-secondary to-accent text-secondary-foreground hover:opacity-90 transition-all font-semibold text-base shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? "Enviando..." : "Cadastrar"}
      </Button>
    </form>
  );
};
