import RequestQuoteForm from "@/components/RequestQuoteForm";

export default function Page() {
  return (
    <main className="min-h-screen py-16 px-6 bg-gray-50 flex justify-center">
      <div className="w-full max-w-3xl">
        <RequestQuoteForm />
      </div>
    </main>
  );
}
