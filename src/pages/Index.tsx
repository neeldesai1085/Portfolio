import ProfileHeader from "@/components/ProfileHeader";
import ContactForm from "@/components/ContactForm";
import Terminal from "@/components/dev/Terminal";

const Index = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <ProfileHeader />
            <main className="flex-1 overflow-hidden">
                {/* <div key={mode} className="h-full animate-fade-in">
                    {mode === "dev" ? <DevMode /> : <HRMode />}
                </div> */}
                <Terminal />
            </main>
            <ContactForm />
        </div>
    );
}

export default Index;