export default (req, res) => {
  return res.render("login/index", {
    title: "Indexador de Vagas",
    layout: "login_register"
  });
};
