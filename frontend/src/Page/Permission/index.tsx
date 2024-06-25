const PermissionPage = () => {
  return (
    <div>
      <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>
        Permission Denied
      </h1>
      <p>Sorry, you don't have permission to access this page.</p>
      <p>
        Click <span> </span>
        <a
          href="/"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          here
        </a>
        <span> </span>
        to return homepage
      </p>
    </div>
  );
};

export default PermissionPage;
