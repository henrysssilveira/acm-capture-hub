import { NewsletterForm } from "@/components/NewsletterForm";

const Index = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl text-center space-y-12">
        {/* Header Section */}
        <header className="space-y-6">
          <div className="space-y-2">
            <p className="text-foreground/70 text-sm md:text-base tracking-wide font-light italic">
              Innovation and Technology
            </p>
            <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tight">
              ACM
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/80 font-light italic tracking-wide">
              Acutis Martech
            </p>
          </div>
          
          <div className="pt-4">
            <p className="text-foreground/70 text-base md:text-lg font-light max-w-lg mx-auto">
              Automação de sistemas integrados e tarefas
            </p>
          </div>
        </header>

        {/* Newsletter Form Section */}
        <section className="pt-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Fique por dentro
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Cadastre-se para receber novidades sobre automação e tecnologia
              </p>
            </div>
            
            <div className="flex justify-center">
              <NewsletterForm />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12">
          <p className="text-foreground/50 text-xs md:text-sm">
            © 2025 ACM - Acutis Martech. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
