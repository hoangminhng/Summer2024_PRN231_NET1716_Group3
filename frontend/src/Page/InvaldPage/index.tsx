const InvalidPage = () => {
    return (
      <div>
        <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>
          Permission Denied
        </h1>
        <p>Sorry, your account had been blocked by administration. Please contact with admin to unblock your account.</p>
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
  
  export default InvalidPage;
  