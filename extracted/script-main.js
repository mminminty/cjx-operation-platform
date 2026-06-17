
    const __cjxRoot = ReactDOM.createRoot(document.getElementById("root"));
    window.__cjxGo = function (route) {
      const C = route === "app" ? window.AppRoot : window.LoginScreen;
      const s = document.querySelector(".screen"); if (s) s.scrollTop = 0;
      __cjxRoot.render(React.createElement(C));
    };
    window.__cjxGo("login");
  