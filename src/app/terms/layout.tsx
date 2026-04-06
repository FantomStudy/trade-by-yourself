const TermsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        marginTop: "calc(-1 * var(--space-md))",
        paddingTop: "var(--space-md)",
        minHeight: "calc(100dvh - 72px)",
      }}
      className="bg-white"
    >
      {children}
    </div>
  );
};

export default TermsLayout;
