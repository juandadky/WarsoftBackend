var express = require('express');
var bodyParser = require('body-parser');
var mssql = require('mssql');

var app = express();
var http = require('http').Server(app);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.post('/usuario/login', function (req, res, next) {
    var request = new mssql.Request();
    var usuario = req.body.usuario;
    var password = req.body.password

    console.log(usuario);
    console.log(password);

    var consulta = "select idUsuario,Usuario,Clave,Tipo,Nombre,Abreviatura,CodVendedor,Empresa,anulacion,pagos,activo,horapedido,credito from Usuarios where activo=1 and (tipo='M' or tipo='X') and usuario='"+ usuario +"' and clave = '"+ password +"'";
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err.originalError.info.message
            })
        } else {
            if (result.rowsAffected > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Inicio Exitoso"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "Usuario y/o contraseña incorrectos"

                });
            }
        }
    });
});

app.get('/clientes/nombre/:nomBuscar', function (req, res, next) {

    var request = new mssql.Request();
    var nomBuscar = req.params.nomBuscar;
    console.log(nomBuscar);
    var consulta = "exec [dbo].[pa_clientes] @tipo=3,@Orden='Nombre',@NomBuscar='"+ nomBuscar +"',@lActivo='1'";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "status": err.originalError.info.message
            })
        } else {
            console.log(result);
            if (result.recordset.length > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo clientes"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se encontró clientes"

                });
            }
        }
    });
});

app.get('/clientes/dniruc/:dniRuc', function (req, res, next) {

    var request = new mssql.Request();
    var dniRuc = req.params.dniRuc;
    var consulta = "exec [dbo].[pa_clientes] @tipo = 3,@Orden = 'Nro. RUC',@NomBuscar= '"+ dniRuc +"',  @lActivo='1'";
    // console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "status": err.originalError.info.message
            })
        } else {
            if (result.recordset.length > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo clientes"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se encontro el cliente"

                });
            }
        }
    });
});

app.get('/tipoCliente/:idCliente', function (req, res, next) {

    var request = new mssql.Request();
    var idCliente = req.params.idCliente;
    var consulta = "exec [dbo].[pa_clientes] @tipo = 3,@Orden = 'IdCliente',@NomBuscar= '"+ idCliente +"', @lActivo='1'";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "status": err.originalError.info.message
            })
        } else {
            console.log(result);
            if (result.recordset.length > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo cliente"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se encontró cliente"
                });
            }
        }
    });
});

app.get("/productos/nombre/:nombProducto/:tipoCliente", function (req, res, next) {
    var request = new mssql.Request();
    var nombProducto = req.params.nombProducto;
    var tipoCliente = req.params.tipoCliente
    
    var consulta = "SELECT    productos.idProducto,dbo.Productos.NombreProducto,productos.IdProveedor,productos.IdCategoria,   dbo.Productos.CantidadPorUnidad,dbo.Productos.Almacen,"+
                    "cast(dbo.Productos.Saldoreal/dbo.productos.factor as int) as Cantidad, dbo.Productos.Saldoreal % dbo.productos.factor as unidades, dbo.productos.saldoconta-productos.unidadespe as saldoconta,"+
                    " dbo.productos.saldoreal-productos.unidadespe as saldoreal, dbo.Productos.UnidadesEnPedido, dbo.PreciosProductos.preciocon, dbo.PreciosProductos.preciocre, dbo.PreciosProductos.PrecioVol, dbo.PreciosProductos.PrecioMay,dbo.PreciosProductos.PrecioMay2,dbo.productos.por_perce,"+
                    "dbo.productos.precio5, dbo.productos.precio6,dbo.productos.precio7, dbo.productos.Preciod1, dbo.productos.Preciod2, dbo.productos.Preciod3, dbo.productos.Preciod4,dbo.productos.costo,"+
                    "dbo.productos.Preciod5,dbo.productos.Preciod6,dbo.productos.Preciod7 ,dbo.productos.factor, dbo.productos.Lote_pedido, dbo.productos.fec_vcmto, dbo.Productos.Afecto_Igv, dbo.productos.codprov,"+
                    "dbo.Categorias.NombreCategoria as Categoria, dbo.MProCli.Nombre as Proveedor,dbo.productos.Suspendido, dbo.productos.codprov, dbo.Productos.Minimo, dbo.productos.Percepcion, dbo.productos.peso,"+
                    "dbo.productos.litros, dbo.marcas.detalle as nombremarca, dbo.productos.idmarca, left(dbo.productos.codigo,2) as Linea, left(dbo.productos.codigo,4) as SubLinea, dbo.Productos.CostoProv,idConta,UniMin,Grupo,subGrupo,unidadesenpedido,ean,unicolgate,faccolgate,controlaboni,combo,"+
<<<<<<< HEAD
                    "Precio8,precio9,precio10,precio11,precio12,preciod8,preciod9,preciod10,preciod11,preciod12,canvolmer,canvolmay,cantidadvol,vendedores,zonas,tiponegocio,canti_max,pordes,productos.desde,productos.hasta,nroitems,tipocombo,surtido, preciovol,cantidadmay,preciomay2,cantidadmay2 "+
=======
                    "Precio8,precio9,precio10,precio11,precio12,preciod8,preciod9,preciod10,preciod11,preciod12,canvolmer,canvolmay,dbo.PreciosProductos.cantidadvol,vendedores,zonas,tiponegocio,canti_max,pordes,productos.desde,productos.hasta,nroitems,tipocombo,surtido, preciovol,preciomay,cantidadmay,preciomay2,cantidadmay2 "+
>>>>>>> 0c9aa75f2792842e1deee1b4832f5d85fc906445
                    "FROM dbo.Productos INNER JOIN "+
                    "dbo.Categorias ON dbo.Productos.IdCategoria = dbo.Categorias.IdCategoria INNER JOIN "+
                    "dbo.MProCli ON dbo.Productos.IdProveedor = dbo.MproCli.IdCliente inner join "+  
                    "dbo.marcas ON dbo.productos.idMarca=dbo.marcas.idmarca inner join "+  
                    "preciosproductos on productos.idproducto=preciosproductos.idproducto and preciosproductos.idTipo="+ tipoCliente +""+
                    " where productos.nombreproducto like '%"+ nombProducto +"%' and productos.suspendido = 0 and saldoreal > 0"
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            console.log(result);
            if (result.recordset != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data,
                    "code": 100,
                    "status": "Se cargo los productos"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No hay productos con ese nombre!"
                });
            }
        }
    });
});

app.get("/productos/id/:idProducto/:tipoCliente", function (req, res, next) {
    var request = new mssql.Request();
    var idProducto = req.params.idProducto;
    var tipoCliente = req.params.tipoCliente
    console.log(""+idProducto)
    var consulta = "exec [dbo].[PA_PRODUCTOS] @tipo=24, @idproducto='"+ idProducto +"',@clitipoprecio='"+ tipoCliente +"'";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            if (result.recordset != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data,
                    "code": 100,
                    "status": "Se cargo los productos"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No hay productos con ese ID!"
                });
            }
        }
    });
});
app.put("/anularPedido/:idPedido", function (req, res, next) {
    var request = new mssql.Request();
    var idPedido = req.params.idPedido;
    var consulta = "exec [dbo].[PA_AnularPedido] @tipo=1,@pedido='"+ idPedido +"',@sino=1,@total=0";
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "status": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se anulo el pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo anular el pedido!"
                });
            }
        }
    });
});
app.post("/registroCabeceraPedido", function (req, res, next) {
    var request = new mssql.Request();
    console.log(req.header('Content-Type'));
    console.log(req.body.idCliente);
    console.log(req.body.idVendedor);
    console.log(req.body.fechaPedido);
    console.log(req.body.tipoVenta);
    console.log(req.body.idTransporte);
    console.log(req.body.idZona);
    console.log(req.body.nroDias);
    console.log(req.body.porceIgv);
    console.log(req.body.porceIgv);
    console.log(req.body.porceIgv);
    console.log(req.body.porceIgv);
    console.log(req.body.porceIgv);
    var idCliente = req.body.idCliente;
    var idVendedor = req.body.idVendedor;
    var fechaPedido = req.body.fechaPedido;
    var tipoVenta = req.body.tipoVenta;
    var idTransporte = req.body.idTransporte;
    var idZona = req.body.idZona;
    var nroDias = req.body.nroDias;
    var porceIgv = req.body.porceIgv;
    var facBolNP = req.body.facBolNP;
    var total = req.body.total;
    var idUsu = req.body.idUsu;
    var clave = req.body.clave;
    
    var consulta = "INSERT INTO [dbo].[Pedidos]" +  
    " ([IdCliente],[IdVendedor],[FechaPedido],[FechaEntrega], [TipoVenta],[idTransporte],[idZona],[Nro_Dias],[Porce_Igv],[Nombre],"+
    "[Tarjeta],[Por_Tarjeta],[Percepcion],[Moneda],[FacBolNP],[Total],[idUsuario],ClaveSuper,redespacho) "  +
    "VALUES ('"+ idCliente +"',"+ idVendedor +",'"+ fechaPedido +"',null,'"+ tipoVenta +"',"+ idTransporte +","+ idZona +","+ nroDias +"," +
    ""+porceIgv+",'',0,0,0,1,"+ facBolNP +","+ total +", "+ idUsu +","+ clave +",0)"+
    " select SCOPE_IDENTITY() as id " +
    "update mprocli set idautorizacre=0 where idcliente='"+ idCliente +"'"
    
    request.query(consulta, function (err, result) {
        if (err) {
            console.log(err)
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            console.log(result)
            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se insertó la cabecera del pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo insertar la cabecera del pedido!"
                });
            }
        }
    });
});

app.post("/registroDetallePedido", function (req, res, next) {
    var request = new mssql.Request();
    console.log(req.header('Content-Type'));
    console.log(req.body.detallePedido);
    var idPedido = req.body.idPedido;
    var idProducto = req.body.idProducto;
    var precioUnidad = req.body.precioUnidad;
    var cantidad = req.body.cantidad;
    var entregado = req.body.entregado;
    var unidades = req.body.unidades;
    var almacen = req.body.almacen;
    var descuento = req.body.descuento;
    var importe = req.body.importe;
    var subtotal = req.body.subtotal;
    var porDescu = req.body.porDescu;
    var factor = req.body.factor;
    var tipoPrecio = req.body.tipoPrecio;
    var porcIgv = req.body.porcIgv;
    var valorVenta = req.body.valorVenta;
    var costo = req.body.costo;
    var idUsu = req.body.idUsu;
    var combo = req.body.combo;
    var idCombo = req.body.idCombo;
    var tipoCombo = req.body.tipoCombo;
    var surtido = req.body.surtido;
    var cantidadSoles = req.body.cantidadSoles;
    var tipoPrecioVol = req.body.tipoPrecioVol;
    

    var consulta = "exec [dbo].[PA_Detalle] @tipo=1,@Registro = 0,@Total = 0,@idpedido="+ idPedido +",@idproducto="+ idProducto +",@preciounidad="+ precioUnidad +""+
                ",@cantidad="+ cantidad +",@entregado="+ entregado +",@unidades="+ unidades +",@almacen="+ almacen +""+
                ",@descuento="+ descuento +",@importe="+ importe +",@subtotal="+ subtotal +",@por_descu="+porDescu +",@factor="+ factor +",@tipoprecio='"+ tipoPrecio +"'"+
                ",@porc_igv="+ porcIgv +",@valorventa="+ valorVenta +",@no_gravado=0,@por_percep=0,@costo="+ costo +",@idusu="+ idUsu +",@combo="+ combo +",@idCombo="+ idCombo +"" + ",@tipocombo ="+ tipoCombo + ",@surtido=" + surtido + ",@cantidad_soles="+ cantidadSoles +",@TipoPrecioVol ="+ tipoPrecioVol +"";

    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se inserto el detalle del producto"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo insertar el detalle del producto!"
                });
            }
        }
    });
});


app.get("/obtenerCabeceraPedidoFacturadoAnulado/idvendedor/:idVendedor/:estado", function (req, res, next) {
    var request = new mssql.Request();
    var idVendedor = req.params.idVendedor;
    var estado = req.params.estado;
    var consulta = "SELECT  TOP 200   p.idPedido,p.fechapedido, p.fechaentrega, p.nro_dias, p.tarjeta, p.por_tarjeta, p.estado,"+ 
    "p.idtransporte, p.idzona, p.idcliente, c.nombre AS nombrecliente, "+
    "z.DETALLE AS nombrezona, c.tipneg, t.Detalle, "+ 
    "p.tipoventa, p.idVendedor, v.nombre as nombrevendedor, "+  
    "c.referencia, c.direccion, c.ruc, c.doc_iden, p.nombre, p.moneda,p.FacBolNP,p.idusuario,p.redespacho,p.total "+  
    "FROM         dbo.pedidos P INNER JOIN "+
    "dbo.mprocli C ON p.idcliente = C.idcliente INNER JOIN "+  
    "dbo.MAEZONAS Z ON p.idzona = z.idZona INNER JOIN "+  
    "dbo.TipNeg t ON c.tipneg = t.idTipoNeg INNER JOIN "+  
    "dbo.maeVende V on p.idvendedor = v.idvendedor "+  
    "where p.IdVendedor="+ idVendedor +" and p.estado='"+ estado +"' ORDER BY p.idPedido DESC";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.recordset.length > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo Pedidos"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No tiene pedidos hasta ahora!"
                });
            }
        }
    });
});

app.get("/obtenerCabeceraPedidoPorFacturar/idvendedor/:idVendedor", function (req, res, next) {
    var request = new mssql.Request();
    var idVendedor = req.params.idVendedor;
    var consulta = "SELECT  TOP 200   p.idPedido,p.fechapedido, p.fechaentrega, p.nro_dias, p.tarjeta, p.por_tarjeta, p.estado,"+ 
    "p.idtransporte, p.idzona, p.idcliente, c.nombre AS nombrecliente, "+
    "z.DETALLE AS nombrezona, c.tipneg, t.Detalle, "+ 
    "p.tipoventa, p.idVendedor, v.nombre as nombrevendedor, "+  
    "c.referencia, c.direccion, c.ruc, c.doc_iden, p.nombre, p.moneda,p.FacBolNP,p.idusuario,p.redespacho, p.total "+  
    "FROM         dbo.pedidos P INNER JOIN "+
    "dbo.mprocli C ON p.idcliente = C.idcliente INNER JOIN "+  
    "dbo.MAEZONAS Z ON p.idzona = z.idZona INNER JOIN "+  
    "dbo.TipNeg t ON c.tipneg = t.idTipoNeg INNER JOIN "+  
    "dbo.maeVende V on p.idvendedor = v.idvendedor "+  
    "where p.IdVendedor="+ idVendedor +" and p.estado is null ORDER BY p.idPedido DESC";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.recordset.length > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo Pedidos"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No tiene pedidos hasta ahora!"
                });
            }
        }
    });
});

app.get("/obtenerCabeceraPedido/idPedido/:idPedido", function (req, res, next) {
    var request = new mssql.Request();
    var idPedido = req.params.idPedido;
    var consulta = "SELECT  p.idPedido,p.fechapedido, p.fechaentrega, p.nro_dias, p.tarjeta, p.por_tarjeta, "+ 
    "p.idtransporte, p.idzona, p.idcliente, c.nombre AS nombrecliente, "+
    "z.DETALLE AS nombrezona, c.tipneg, t.Detalle, "+ 
    "p.tipoventa, p.idVendedor, v.nombre as nombrevendedor, "+  
    "c.referencia, c.direccion, c.ruc, c.doc_iden, p.nombre, p.moneda,p.FacBolNP,p.idusuario,p.redespacho "+  
    "FROM         dbo.pedidos P INNER JOIN "+
    "dbo.mprocli C ON p.idcliente = C.idcliente INNER JOIN "+  
    "dbo.MAEZONAS Z ON p.idzona = z.idZona INNER JOIN "+  
    "dbo.TipNeg t ON c.tipneg = t.idTipoNeg INNER JOIN "+  
    "dbo.maeVende V on p.idvendedor = v.idvendedor "+  
    "where p.idPedido="+ idPedido +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.recordset.length > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo el pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No existe un pedido con ese ID!"
                });
            }
        }
    });
});

app.get("/obtenerDetallePedido/idPedido/:idPedido", function (req, res, next) {
    var request = new mssql.Request();
    var idPedido = req.params.idPedido;
    var consulta = "exec [dbo].[pa_obtdetallepedido] @Pedido="+ idPedido +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.recordset.length > 0) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo los detalles del pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No hay detalles de ese pedido!"
                });
            }
        }
    });
});

app.get("/obtenerPagoCredito/:idCliente", function (req, res, next) {
    var request = new mssql.Request();
    var idCliente = req.params.idCliente;
    var consulta = "exec [dbo].[pa_cogediaspagocredito] @idcliente="+ idCliente +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo los detalles del pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No hay detalles de ese pedido!"
                });
            }
        }
    });
});

app.get("/obtenerAtraso/:idCliente", function (req, res, next) {
    var request = new mssql.Request();
    var idCliente = req.params.idCliente;
    var consulta = "exec [dbo].[pa_buscafacatraz] @idcliente="+ idCliente +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Cargo los detalles del pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No hay detalles de ese pedido!"
                });
            }
        }
    });
});

app.get("/obtenerPagosPendientes/:idCliente/:fechaInicio/:fechaFinal", function (req, res, next) {
    var request = new mssql.Request();
    var idCliente = req.params.idCliente;
    var fechaInicio = req.params.fechaInicio;
    var fechaFinal = req.params.fechaFinal;

    console.log(fechaInicio);
    console.log(fechaFinal);

    var consulta = "exec [dbo].[PA_saldodocs] @tipo = 7, @idcliente="+ idCliente +", @signo = -1, @fecha1= '"+ fechaInicio +"', @fecha2='"+ fechaFinal +"'";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron las deudas pendientes"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No tiene deudas el cliente"
                });
            }
        }
    });
});


app.post("/registrarPagoPendiente", function (req, res, next) {
    var request = new mssql.Request();
    console.log(req.header('Content-Type'));
    var idCliente = req.body.idCliente;
    var fecha = req.body.fecha;
    var idDocumento = req.body.idDocumento;
    var serie = req.body.serie;
    var numero = req.body.numero;
    var tipoDoc = req.body.tipoDoc;
    var importe = req.body.importe;
    var idUsuario = req.body.idUsuario;
    
    var consulta = "exec [dbo].[PA_PAGOS] @tipo = 1, @idEmpresa = 1, @fecha='"+ fecha +"', @fechaaplica = '"+  fecha +"',"+
    " @idCliente="+ idCliente +", @iddocumento= "+ idDocumento +", @serie='"+ serie +"',@numero= "+ numero +", @tipodoc="+ tipoDoc +",@signo = -1,"+
    " @idtipoPago = 1, @numerodocpago ='0', @cuenta = '0', @idbanco = 1, @moneda = 1, @importe = "+ importe +", @entidad='', @idGasto= 1, @dolares = 0,"+
    " @tipocambio = 0, @AfectaCaja = 1, @idCentroCosto = 0, @NroRecibo = '0', @Oi = '0', @Verificado = 1, @idusuasis = "+ idUsuario +",@Amortiza="+ importe +"";
    console.log(consulta);

    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                console.log(data);
                res.send({
                    result: data, "code": 100,
                    "status": "Se inserto el detalle del producto"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo insertar el detalle del producto!"
                });
            }
        }
    });
});


app.post("/registrarCliente", function (req, res, next) {
    var request = new mssql.Request();
    console.log(req.header('Content-Type'));
    var nombre = req.body.nombre;
    var direccion = req.body.direccion;
    var docIden = req.body.docIden;
    var ruc = req.body.ruc;
    var telefono = req.body.telefono;
    var fPago = req.body.fPago;
    var idZona = req.body.idZona;
    var tipNeg = req.body.tipNeg;
    var referencia = req.body.referencia;
    var boletear = req.body.boletear;
    var tipoCliente = req.body.tipoCliente;
    var celular = req.body.celular;
    var visita = req.body.visita;
    var lCredito = req.body.lCredito;
    var ctaDetra = req.body.ctaDetra;
    var idDistrito = req.body.idDistrito;
    var idVendedor = req.body.idVendedor;
    var cliProv = req.body.cliProv;
    var idVendedor2 = req.body.idVendedor2;
    var idZona2 = req.body.idZona2;
    var visita2 = req.body.visita2;
    var lCredito2 = req.body.lCredito2;
    var zona = req.body.zona;
    var email = req.body.email;
    var lista = req.body.lista;
    var preciovolumen = req.body.preciovolumen;
    
    var consulta = "exec [dbo].[pa_clientes] @tipo = 1, @Nombre = '"+ nombre +"', @Direccion='"+ direccion +"', @Doc_Iden = '"+  docIden +"',"+
    " @Ruc='"+ ruc +"', @Telefono1= '"+ telefono +"', @FPago='"+ fPago +"',@idZona= "+ idZona +", @Tip_Neg="+ tipNeg +",@Referencia = '"+ referencia +"',"+
    " @Boletear = '"+ boletear +"', @TipoCliente = '"+ tipoCliente +"', @Celular = '"+ celular +"', @Nextel = '', @Visita = "+ visita +", @LCredito = "+ lCredito +", @CtaDetra='"+ ctaDetra +"', @idDistrito= "+ idDistrito +", @idVendedor = "+ idVendedor +","+
    " @CliProv = "+ cliProv +", @idvendedor2 = "+ idVendedor2 +", @idzona2 = "+ idZona2 +", @visita2 = "+ visita2 +", @LCredito2 = "+ lCredito2 +", @zona = '"+ zona +"', @email = '"+ email +"',@lista='"+ lista +"',@preciovolumen="+ preciovolumen +"";
    console.log(consulta);

    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                console.log(data);
                res.send({
                    result: data, "code": 100,
                    "status": "Se inserto el detalle del producto"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo insertar el detalle del producto!"
                });
            }
        }
    });
});


app.get("/obtenerZona", function (req, res, next) {
    var request = new mssql.Request();
    var consulta = "SELECT * FROM MaeZonas";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron las zonas"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener las zonas"
                });
            }
        }
    });
});

app.get("/obtenerTipoNegocio", function (req, res, next) {
    var request = new mssql.Request();
    var consulta = "SELECT * FROM TipNeg";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron los tipos de negocio"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener los tipos de negocio"
                });
            }
        }
    });
});

app.get("/obtenerTipodePrecio", function (req, res, next) {
    var request = new mssql.Request();
    var consulta = "SELECT * FROM TiposdePrecios";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron los tipos de precio"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener los tipos de precio"
                });
            }
        }
    });
});

app.get("/obtenerAvanceVentas/:idVendedor/:fechaInicio/:fechaFinal/:tipo/:linea/:sublinea/:fuerza", function (req, res, next) {
    var request = new mssql.Request();
    var idVendedor = req.params.idVendedor;
    var fechaInicio = req.params.fechaInicio;
    var fechaFinal = req.params.fechaFinal;
    var tipo = req.params.tipo;
    var linea = req.params.linea;
    var sublinea = req.params.sublinea;
    var fuerza = req.params.fuerza;

    console.log(fechaInicio);
    console.log(fechaFinal);

    var consulta = "exec PA_ResVtasxVenxPorcApp @fecha1='"+ fechaInicio +"',@fecha2='"+ fechaFinal +"',@tipo="+ tipo +",@Linea='"+ linea +"',@SubLinea='"+ sublinea +"',@Grupo=null,@SubGrupo=null,@fuerza = "+ fuerza +", @marca=null,@idvendedor="+ idVendedor +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron las deudas pendientes"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No tiene deudas el cliente"
                });
            }
        }
    });
});

app.get("/obtenerCategoria", function (req, res, next) {
    var request = new mssql.Request();
    var consulta = "SELECT * FROM Categorias where activo = 1";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron las categorias"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener las cagetorias"
                });
            }
        }
    });
});



app.put("/actualizarCabeceraPedido/:idPedido/:total", function (req, res, next) {
    var request = new mssql.Request();
    var idPedido = req.params.idPedido;
    var total = req.params.total;
    var consulta = "UPDATE Pedidos SET Total = "+ total +" WHERE IdPedido = "+ idPedido+"";
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "status": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se actualizó la cabecera del pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo actualizar la cabecera del pedido!"
                });
            }
        }
    });
});

app.put("/actualizarDetallePedido/:idPedido/:idProducto/:cantidad/:unidades/:subtotal/:importe", function (req, res, next) {
    var request = new mssql.Request();
    var idPedido = req.params.idPedido;
    var idProducto = req.params.idProducto;
    var cantidad = req.params.cantidad;
    var unidades = req.params.unidades;
    var subtotal = req.params.subtotal;
    var importe = req.params.importe;
    var consulta = "UPDATE Detallesdepedidos set Cantidad = "+ cantidad +",unidades="+ unidades +", subtotal = "+ subtotal +", importe = "+ importe +""+
    " WHERE IdPedido = "+ idPedido +" AND IdProducto = "+ idProducto +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "status": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se actualizó el detalle del pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo actualizar el detalle del pedido!"
                });
            }
        }
    });
});

app.delete("/eliminarDetallePedido/:idPedido/:idProducto", function (req, res, next) {
    var request = new mssql.Request();
    var idPedido = req.params.idPedido;
    var idProducto = req.params.idProducto;
    var consulta = "DELETE FROM Detallesdepedidos WHERE IdPedido = "+ idPedido +" AND IdProducto = "+ idProducto +"";
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "status": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se eliminó el detalle del pedido"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo eliminar el detalle del pedido pedido!"
                });
            }
        }
    });
});

app.get("/obtenerClientes/:idVendedor", function (req, res, next) {
    var request = new mssql.Request();
    idVendedor = req.params.idVendedor;
    var consulta = "select * from MProCli where idVendedor = "+ idVendedor +" or idVendedor2 = "+ idVendedor +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron los clientes"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener los clientes"
                });
            }
        }
    });
});

app.get("/obtenerProductos", function (req, res, next) {
    var request = new mssql.Request();
    var consulta = "SELECT * FROM productos WHERE suspendido = 0";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron los productos"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener los productos"
                });
            }
        }
    });
});

app.get("/obtenerDeudas", function (req, res, next) {
    var request = new mssql.Request();
    var consulta = "select * from documentoorden where total>(tot_pago+0.5) and signo=-1 and tipodoc in(1,3,11) and estado='AC'";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron las deudas"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener las deudas"
                });
            }
        }
    });
});

app.get("/obtenerCabeceraDescuento/:idProducto/:fecha/:tipo", function (req, res, next) {
    var request = new mssql.Request();
    var idProducto = req.params.idProducto;
    var fecha = req.params.fecha;
    var tipo = req.params.tipo;
    var consulta = "exec pa_ubicacabecradescuento @idproducto="+ idProducto +",@f1='"+ fecha +"',@tipo="+ tipo +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data, "code": 100,
                    "status": "Se cargaron las promociones"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo obtener las promociones"
                });
            }
        }
    });
});

app.get("/obtenerPromoDescuento/nombre/:nombProducto/:tipoCliente", function (req, res, next) {
    var request = new mssql.Request();
    var nombProducto = req.params.nombProducto;
    var tipoCliente = req.params.tipoCliente
    
    var consulta = "SELECT    productos.idProducto,dbo.Productos.NombreProducto,productos.IdProveedor,productos.IdCategoria,   dbo.Productos.CantidadPorUnidad,dbo.Productos.Almacen,"+
                    "cast(dbo.Productos.Saldoreal/dbo.productos.factor as int) as Cantidad, dbo.Productos.Saldoreal % dbo.productos.factor as unidades, dbo.productos.saldoconta,"+
                    "dbo.productos.saldoreal, dbo.Productos.UnidadesEnPedido, dbo.PreciosProductos.preciocon, dbo.PreciosProductos.preciocre, dbo.PreciosProductos.PrecioVol, dbo.PreciosProductos.PrecioMay,dbo.PreciosProductos.PrecioMay2,dbo.productos.por_perce,"+
                    "dbo.productos.precio5, dbo.productos.precio6,dbo.productos.precio7, dbo.productos.Preciod1, dbo.productos.Preciod2, dbo.productos.Preciod3, dbo.productos.Preciod4,dbo.productos.costo,"+
                    "dbo.productos.Preciod5,dbo.productos.Preciod6,dbo.productos.Preciod7 ,dbo.productos.factor, dbo.productos.Lote_pedido, dbo.productos.fec_vcmto, dbo.Productos.Afecto_Igv, dbo.productos.codprov,"+
                    "dbo.Categorias.NombreCategoria as Categoria, dbo.MProCli.Nombre as Proveedor,dbo.productos.Suspendido, dbo.productos.codprov, dbo.Productos.Minimo, dbo.productos.Percepcion, dbo.productos.peso,"+
                    "dbo.productos.litros, dbo.marcas.detalle as nombremarca, dbo.productos.idmarca, left(dbo.productos.codigo,2) as Linea, left(dbo.productos.codigo,4) as SubLinea, dbo.Productos.CostoProv,idConta,UniMin,Grupo,subGrupo,unidadesenpedido,ean,unicolgate,faccolgate,controlaboni,combo,"+
                    "Precio8,precio9,precio10,precio11,precio12,preciod8,preciod9,preciod10,preciod11,preciod12,canvolmer,canvolmay,dbo.PreciosProductos.cantidadvol "+
                    "FROM dbo.Productos INNER JOIN "+
                    "dbo.Categorias ON dbo.Productos.IdCategoria = dbo.Categorias.IdCategoria INNER JOIN "+
                    "dbo.MProCli ON dbo.Productos.IdProveedor = dbo.MproCli.IdCliente inner join "+  
                    "dbo.marcas ON dbo.productos.idMarca=dbo.marcas.idmarca inner join "+  
                    "preciosproductos on productos.idproducto=preciosproductos.idproducto and preciosproductos.idTipo="+ tipoCliente +""+
                    " where productos.nombreproducto like '%"+ idProducto +"%' and productos.suspendido = 0 and saldoreal > 0 and combo = 1"
                    
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            console.log(result);
            if (result.recordset != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data,
                    "code": 100,
                    "status": "Se cargo los productos"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No hay productos con ese nombre!"
                });
            }
        }
    });
});



app.get("/obtenerPromoDescuento/id/:idProducto/:tipoCliente", function (req, res, next) {
    var request = new mssql.Request();
    var idProducto = req.params.idProducto;
    var tipoCliente = req.params.tipoCliente
    
    var consulta = "SELECT    productos.idProducto,dbo.Productos.NombreProducto,productos.IdProveedor,productos.IdCategoria,   dbo.Productos.CantidadPorUnidad,dbo.Productos.Almacen,"+
                    "cast(dbo.Productos.Saldoreal/dbo.productos.factor as int) as Cantidad, dbo.Productos.Saldoreal % dbo.productos.factor as unidades, dbo.productos.saldoconta,"+
                    "dbo.productos.saldoreal, dbo.Productos.UnidadesEnPedido, dbo.PreciosProductos.preciocon, dbo.PreciosProductos.preciocre, dbo.PreciosProductos.PrecioVol, dbo.PreciosProductos.PrecioMay,dbo.PreciosProductos.PrecioMay2,dbo.productos.por_perce,"+
                    "dbo.productos.precio5, dbo.productos.precio6,dbo.productos.precio7, dbo.productos.Preciod1, dbo.productos.Preciod2, dbo.productos.Preciod3, dbo.productos.Preciod4,dbo.productos.costo,"+
                    "dbo.productos.Preciod5,dbo.productos.Preciod6,dbo.productos.Preciod7 ,dbo.productos.factor, dbo.productos.Lote_pedido, dbo.productos.fec_vcmto, dbo.Productos.Afecto_Igv, dbo.productos.codprov,"+
                    "dbo.Categorias.NombreCategoria as Categoria, dbo.MProCli.Nombre as Proveedor,dbo.productos.Suspendido, dbo.productos.codprov, dbo.Productos.Minimo, dbo.productos.Percepcion, dbo.productos.peso,"+
                    "dbo.productos.litros, dbo.marcas.detalle as nombremarca, dbo.productos.idmarca, left(dbo.productos.codigo,2) as Linea, left(dbo.productos.codigo,4) as SubLinea, dbo.Productos.CostoProv,idConta,UniMin,Grupo,subGrupo,unidadesenpedido,ean,unicolgate,faccolgate,controlaboni,combo,"+
                    "Precio8,precio9,precio10,precio11,precio12,preciod8,preciod9,preciod10,preciod11,preciod12,canvolmer,canvolmay,dbo.PreciosProductos.cantidadvol "+
                    "FROM dbo.Productos INNER JOIN "+
                    "dbo.Categorias ON dbo.Productos.IdCategoria = dbo.Categorias.IdCategoria INNER JOIN "+
                    "dbo.MProCli ON dbo.Productos.IdProveedor = dbo.MproCli.IdCliente inner join "+  
                    "dbo.marcas ON dbo.productos.idMarca=dbo.marcas.idmarca inner join "+  
                    "preciosproductos on productos.idproducto=preciosproductos.idproducto and preciosproductos.idTipo="+ tipoCliente +""+
                    " where productos.idProducto = "+ idProducto +" and productos.suspendido = 0 and saldoreal > 0 and combo = 1"
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            res.send({
                "code": 400,
                "failed": err
            })
        } else {
            console.log(result);
            if (result.recordset != null) {
                var data = {};
                data = result.recordset;
                res.send({
                    result: data,
                    "code": 100,
                    "status": "Se cargo los productos"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No hay productos con ese nombre!"
                });
            }
        }
    });
});

<<<<<<< HEAD
app.put("/actualizarCliente/:idCliente/:direccion/:referencia/:telefono/:celular", function (req, res, next) {
    var request = new mssql.Request();
    var idCliente = req.params.idCliente;
    var direccion = req.params.direccion;
    var referencia = req.params.referencia;
    var telefono = req.params.telefono;
    var celular = req.params.celular;
    if(telefono == "Nodata"){
        telefono = "";
    }
    if(celular == "Nodata"){
        celular = "";
    }
    var consulta = "update mprocli set Direccion='"+ direccion +"',Referencia='"+ referencia +"',Telefono1='"+ telefono +"',Celular='"+ celular +"' where idcliente="+ idCliente +"";
    console.log(consulta);
    request.query(consulta, function (err, result) {
        if (err) {
            console.log(err);
            res.send({
                "code": 400,
                "status": err
            })
        } else {

            if (result.rowsAffected != null) {
                var data = {};
                data = result.recordset;
                console.log(data);
                res.send({
                    result: data, "code": 100,
                    "status": "Se actualizó la informacion del usuario"
                });
            }
            else {
                res.send({
                    "code": 200,
                    "status": "No se pudo actualizar la informacion del usuario!"
                });
            }
        }
    });
});

module.exports=app
=======
module.exports=app
>>>>>>> 0c9aa75f2792842e1deee1b4832f5d85fc906445
