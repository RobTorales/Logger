<<<<<<< HEAD
const obtenerIdCarrito = async () => {
  try {
    const response = await fetch("/api/carts/usuario/carrito", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error obteniendo el ID del carrito");
      return null;
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.log("Error en obtener el Id del Carrito! ", error);
    return null;
  }
};

const agregarProductoAlCarrito = async (pid) => {
  try {
    const cid = await obtenerIdCarrito();

    if (!cid) {
      console.error("El ID del carrito es inválido.");
      return;
    }
    
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });

    if (!response.ok) {
      console.log("Error al agregar el producto al carrito");
      return;
    } 
    console.log("Se agrego el producto al carrito");
  } catch (error) {
    console.log("Error en agregar el Producto al Carrito! " + error);
  }
};

async function realizarCompra() {
  try {
    const cid = await obtenerIdCarrito();
  
    if (!cid) {
      console.error("Carrito no encontrado");
      return;
    }

    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
 
    if (!response.ok) {
      console.error("Error al realizar la compra");
      return;
    }
    
    console.log("Compra realizada con éxito"); 

  } catch (error) {
    console.error("Error al realizar la compra", error);
  }

}
=======
const crearCarrito = async () => {
    try {
      if (localStorage.getItem("carrito")) {
        return JSON.parse(localStorage.getItem("carrito"));
      } else {
        const response = await fetch("/api/carts/", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const data = await response.json();
        console.log("Data del carrito:", data);
        localStorage.setItem("carrito", JSON.stringify({ id: data.id }));
        return { id: data.id };
      }
    } catch (error) {
      console.log("Error en Crear el Carrito! " + error);
    }
  };
  
  const obtenerIdCarrito = async () => {
    try {
      let cart = await crearCarrito();
      console.log("Carrito obtenido:", cart);
      if (!cart.id) {
        console.error("El ID del carrito es undefined");
      }
      return cart.id;
    } catch (error) {
      console.log("Error en obtener el Id del Carrito! " + error);
    }
  };
  
  const agregarProductoAlCarrito = async (pid) => {
    try {
      let cid = await obtenerIdCarrito();
      console.log("Verificando IDs:", cid, pid);
  
      if (!cid) {
        console.error("El CID es undefined.");
        return;
      }
      console.log("Verificando IDs:", cid, pid);
      const response = await fetch("/api/carts/" + cid + "/products/" + pid, {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Se agregó al Carrito!", data);
      } else {
        console.log(
          "Error en agregar el Producto al Carrito! Status:",
          response.status,
          data
        );
      }
    } catch (error) {
      console.log("Error en agregar el Producto al Carrito! " + error);
    }
  };
  
  async function realizarCompra() {
    try {
      const cartId = await obtenerIdCarrito();
      console.log("Cart ID:", cartId);
      if (!cartId) {
        throw new Error("Carrito no encontrado");
      }
  
      const url = `/api/carts/${cartId}/purchase`; 
      console.log("URL de compra:", url); 
  
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response:", response);
      if (!response.ok) {
        console.error("Error en la respuesta", response.statusText);
        const text = await response.text();
        console.error(text);
        return;
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log("Compra realizada con éxito", data); 
      } else {
        console.error("Respuesta no JSON:", await response.text());
      }
    } catch (error) {
      console.error("Error al realizar la compra", error);
    }
  
    
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById("cartButton");
  
    if (cartButton) {
      cartButton.addEventListener("click", async () => {
        try {
          const cartId = await obtenerIdCarrito();
          if (cartId) {
            window.location.href = `/carts/${cartId}`;
          } else {
            console.error("El ID del carrito es undefined");
          }
        } catch (error) {
          console.error("Error al obtener el ID del carrito: " + error);
        }
      });
    }
  });
>>>>>>> e220402e43f08c021df8af284c35a02549459871


document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");

  if (cartButton) {
    cartButton.addEventListener("click", async () => {
      try {
        const cid = await obtenerIdCarrito();
        if (cid) {
          window.location.assign(`/carts/`);
        } else {
          console.error("El ID del carrito no es valido");
        }
      } catch (error) {
        console.error("Error al obtener el ID del carrito: " + error);
      }
      e.preventDefault();
    });
  }
});