export default (req, res) => {
  return res.render("user/login", {
    title: "Indexador de Vagas - Login",
    layout: "login_register"
  });
};
