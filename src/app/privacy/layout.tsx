const PrivacyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="bg-white"
      style={{
        marginTop: "calc(-1 * var(--space-md))",
        paddingTop: "var(--space-md)",
        minHeight: "calc(100dvh - 72px)",
      }}
    >
      {children}
    </div>
  );
};

export default PrivacyLayout;
