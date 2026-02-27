import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import emailjs from "@emailjs/browser";
import * as Toast from "@radix-ui/react-toast";
import * as Form from "@radix-ui/react-form";
import * as Dialog from "@radix-ui/react-dialog";

export default function ContactForm() {
    const { contactOpen, setContactOpen, mode } = usePortfolioStore();
    const isDev = mode === "dev";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastTitle, setToastTitle] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await emailjs.send(
                import.meta.env.VITE_SERVICE_ID,
                import.meta.env.VITE_TEMPLATE_ID,
                {
                    name,
                    email,
                    title: "Portfolio Contact",
                    message,
                    time: new Date().toLocaleString(),
                },
                import.meta.env.VITE_PUBLIC_KEY,
            );

            setToastTitle("Success");
            setToastMessage("I will get back to you as soon as possible!");
            setToastOpen(true);

            setName("");
            setEmail("");
            setMessage("");
            setContactOpen(false);
        } catch {
            setToastTitle("Error");
            setToastMessage("Something went wrong. Please try again later.");
            setToastOpen(true);
        }
    };

    return (
        <Toast.Provider swipeDirection="right">
            <Dialog.Root open={contactOpen} onOpenChange={setContactOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

                    <Dialog.Content
                        className={`fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl p-6 border ${
                            isDev
                                ? "bg-terminal-surface border-terminal-border text-terminal-text"
                                : "bg-card border-border text-card-foreground"
                        }`}
                    >
                        <Dialog.Title className="text-lg font-semibold mb-2">
                            Get in Touch
                        </Dialog.Title>

                        <Form.Root
                            onSubmit={handleSubmit}
                            className="space-y-4 mt-4"
                        >
                            <Form.Field name="name">
                                <Form.Label
                                    className={`block text-sm font-medium ${
                                        isDev
                                            ? "text-terminal-muted"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    Your Name
                                </Form.Label>
                                <Form.Control asChild>
                                    <input
                                        required
                                        maxLength={100}
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className={`w-full rounded-md px-3 py-2 border transition focus:outline-none focus:ring-2 ${
                                            isDev
                                                ? "bg-terminal-surface border-terminal-border text-terminal-text focus:ring-terminal-accent"
                                                : "bg-muted border-border text-foreground focus:ring-primary"
                                        }`}
                                    />
                                </Form.Control>
                                <Form.Message
                                    match="valueMissing"
                                    className={`text-sm ${
                                        isDev
                                            ? "text-terminal-accent"
                                            : "text-primary"
                                    }`}
                                >
                                    Please enter your name
                                </Form.Message>
                            </Form.Field>

                            <Form.Field name="email">
                                <Form.Label
                                    className={`block text-sm font-medium ${
                                        isDev
                                            ? "text-terminal-muted"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    Your Email
                                </Form.Label>
                                <Form.Control asChild>
                                    <input
                                        type="email"
                                        required
                                        maxLength={255}
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className={`w-full rounded-md px-3 py-2 border transition focus:outline-none focus:ring-2 ${
                                            isDev
                                                ? "bg-terminal-surface border-terminal-border text-terminal-text focus:ring-terminal-accent"
                                                : "bg-muted border-border text-foreground focus:ring-primary"
                                        }`}
                                    />
                                </Form.Control>
                                <Form.Message
                                    match="valueMissing"
                                    className={`text-sm ${
                                        isDev
                                            ? "text-terminal-accent"
                                            : "text-primary"
                                    }`}
                                >
                                    Please enter your email
                                </Form.Message>
                                <Form.Message
                                    match="typeMismatch"
                                    className={`text-sm ${
                                        isDev
                                            ? "text-terminal-accent"
                                            : "text-primary"
                                    }`}
                                >
                                    Please provide a valid email
                                </Form.Message>
                            </Form.Field>

                            <Form.Field name="message">
                                <Form.Label
                                    className={`block text-sm font-medium ${
                                        isDev
                                            ? "text-terminal-muted"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    Your Message
                                </Form.Label>
                                <Form.Control asChild>
                                    <textarea
                                        required
                                        maxLength={1000}
                                        rows={4}
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        className={`w-full rounded-md px-3 py-2 border transition focus:outline-none focus:ring-2 ${
                                            isDev
                                                ? "bg-terminal-surface border-terminal-border text-terminal-text focus:ring-terminal-accent"
                                                : "bg-muted border-border text-foreground focus:ring-primary"
                                        }`}
                                    />
                                </Form.Control>
                                <Form.Message
                                    match="valueMissing"
                                    className={`text-sm ${
                                        isDev
                                            ? "text-terminal-accent"
                                            : "text-primary"
                                    }`}
                                >
                                    Please enter a message
                                </Form.Message>
                            </Form.Field>

                            <Form.Submit asChild>
                                <button
                                    type="submit"
                                    className={`w-full py-2 rounded-md text-xs font-medium transition-colors ${
                                        isDev
                                            ? "bg-terminal-accent/15 text-terminal-accent hover:bg-terminal-accent/25"
                                            : "bg-primary/10 text-primary hover:bg-primary/20"
                                    }`}
                                >
                                    Send Message
                                </button>
                            </Form.Submit>
                        </Form.Root>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Toast.Root
                open={toastOpen}
                onOpenChange={setToastOpen}
                className={`border rounded-lg shadow-xl p-4 ${
                    isDev
                        ? "bg-terminal-surface border-terminal-border text-terminal-text"
                        : "bg-card border-border text-card-foreground"
                }`}
            >
                <Toast.Title className="font-semibold">
                    {toastTitle}
                </Toast.Title>
                <Toast.Description
                    className={`text-sm ${
                        isDev ? "text-terminal-muted" : "text-muted-foreground"
                    }`}
                >
                    {toastMessage}
                </Toast.Description>
            </Toast.Root>

            <Toast.Viewport className="fixed bottom-5 right-5 w-80 z-50" />
        </Toast.Provider>
    );
}
