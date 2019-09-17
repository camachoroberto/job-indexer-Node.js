export default (req, res) => {
    return res.render("user/register", {
      title: "Indexador de Vagas - Novo UsuArio",
      layout: "login_register"
    });
  };