export default (req, res) => {
  return res.render("users/register", {
    title: "Indexador de Vagas - Novo UsuArio",
    layout: "login_register"
  });
};
