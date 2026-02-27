import ProfileHeader from "@/components/ProfileHeader";
import ContactForm from "@/components/ContactForm";

const Index = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <ProfileHeader />
            <main className="flex-1 overflow-hidden">
                {/* <div key={mode} className="h-full animate-fade-in">
                    {mode === "dev" ? <DevMode /> : <HRMode />}
                </div> */}
            </main>
            <ContactForm />
        </div>
    );
}

export default Index;