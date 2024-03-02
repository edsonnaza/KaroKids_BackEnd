require('dotenv').config();
const nodeMailer = require('nodemailer');
// const path = require('path') //Sirve para importar archivos desde un directorio.

//todo Podríamos importar desde el componente que se encarga de ejecutar esta función los valores de "nombre_usuario" y de "usuario_email". para incorporarlos de manera genérica donde haga falta
const nombre_usuario = 'Alberto'
const usuario_email  = 'albert_london@gmail.com'
const numeroOrden = 12345
// const { nombre, compra_talla, compra_color, compra_cantidad, total_compra } = productos_compra
// const { data.status, data.status_detail, data.description, data.currency_id, data.transaction_amount } = data de MercadoPago --> Ver NOTA al pie.

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL, //?Dirección de email del remitente.
        pass: process.env.ADMIN_EMAIL_PASSWORD, //?App password de la cuenta de Gmail.
    },
});


//todo Mail en el caso de que el pago haya sido aprovado y acreditado:
const htmlAccredited = `
<div>
    <table align="center" border="0">
        <tbody style="text-align:center">
            
            <tr>
                <td style="text-align:center"> <!-- Banner del local -->
                    <img src="https://res.cloudinary.com/dk4ysl2hw/image/upload/v1709280151/Imagenes_Productos/Logos/Banner_con_logo_cczr1m.png" alt="banner_con_logo_Cloudinary" style="width:725px;height:292px" class="CToWUd a6T" data-bit="iit" tabindex="0">
                </td>
            </tr>
 
            <tr>               
                <td>&nbsp;</td> <!-- Espacio en blanco -->
            </tr>

            <tr>
                <td><h1>¡Hola ${nombre_usuario}!</h1></td>
                
            </tr>
            <tr>
                <td><h2>¡Muchas gracias por elegirnos y confiar en nosotros!</h2></td>
            </tr>
            <tr>
                <td><h2>Acabamos de registrar tu compra con el siguiente detalle:</h2></td>
            </tr>

            <tr>               
                <td>&nbsp;</td> <!-- Espacio en blanco -->
            </tr>

            <tr>               
                <td style="text-align:center;font-size:15px;padding:16px 16px 16px 16px">
                    <h3>Número de orden: ${numeroOrden}</h3>
                </td>
            </tr>

            <tr>
                <td style="text-align:center">
                    <table align="center" border="0" cellpadding="0" style="background-color:#f2f4f8;border:1px solid #d9dbde;border-radius:3px;font-family:arial,sans-serif;max-width:600px">
                        <tbody>
                            <tr>
                                <td style="font-size:15px;padding:16px 16px 16px 16px">
                                Listado de productos:
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:0 16px 4px 16px">
                                    <table border="0" cellpadding="0" cellspacing="0" style="color:#a5a5a5;font-size:13px" width="100%">
                                        <tbody>
                                            <!-- Cada "<tr>"" podría renderizarse a partir de un map del array de productos comprados -->
                                                <!-- productos_compra?.map((producto, index) => {
                                                    <tr key="index">
                                                        <td align="left">{producto.nombre}</td>
                                                        <td align="right">{producto.compra_talla, producto.compra_color, producto.compra_cantidad}</td>
                                                    </tr>
                                                }) -->
                                            <tr>
                                                <td align="left">Producto 1</td>
                                                <td align="right"> Detalle 1</td>
                                                <!-- <td align="center">Detalle 1</td> -->
                                                <!-- <td align="right">COP Precio_unitario 1</td> -->
                                            </tr>
                                            <tr>
                                                <td align="left">Producto 2</td>
                                                <td align="right"> Detalle 2</td>
                                                <!-- <td align="center">Detalle 2</td> -->
                                                <!-- <td align="right">COP Precio_unitario 2</td> -->
                                            </tr>
                                            <tr>
                                                <td align="left">Producto 3</td>
                                                <td align="right"> Detalle 3</td>
                                                <!-- <td align="center">Detalle 3</td> -->
                                                <!-- <td align="right">COP Precio_unitario 3</td> -->

                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="text-align:center;font-size:15px;padding:16px 16px 16px 16px">
                                    Monto total de la compra:
                                </td>
                            <tr/>
                            </tr>                            
                                <td align="left">{data.currency_id}</td>  <!-- Sacado del objeto que devuelve MercadoPago -->
                                <td align="right">{producto.total_compra}</td>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            <tr>
                <td style="text-align:center"><br>
                Puedes descargar tu factura electrónica haciendo <a><u>click aquí</u></a></td>
            </tr>

            <tr>
                <td style="text-align:center"><br>
                Comunícate con nosotros a través de los siguientes canales de diálogo:
                </td>
            </tr>
             <!-- Banner con links a redes sociales de la empresa -->
            <tr>
                <td style="text-align:center"><br>
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbkSTBO6pxdJwLtW4OTRDMm4j6g6UBHrwWt7e7IXGtrW7iAqvht8VPEZFm1yKn1YjsO1FisQ9DX1gU48qz97FoSaBXaLes9n0Rrvof2gOlvPdN6YJ75Xt67gAR-TLv7FMltVw=s0-d-e1-ft#https://federadasalud.yul1.qualtrics.com/CP/Graphic.php?IM=IM_WA09ciwezj1vgdx" style="width:725px;height:75px" class="CToWUd" data-bit="iit"></td>
            </tr>
        </tbody>
    
    </table>    
</div>
`

const mailOptions = {
    from: {
        name: 'Karo Kids',
        address: process.env.ADMIN_EMAIL
    },
    to: 'jgerfuentes@gmail.com',
    //? to: [usuario_email, 'jgerfuentes@gmail.com'], // Se puede colocar una lista de receptores.

    subject: "¡Nueva compra en KaroKids registrada con éxito! ✔", // Subject line
    html: htmlAccredited,
    //? attachments: [
            // Se añade la ruta al archivo PDF qeu se encuentra almacenado de manera local.
    //     {
    //         filename: 'factura.pdf',
    //         path: path.join(__dirname, 'factura.pdf'),
    //         contentType: 'application/pdf'
    //     },
            //Opción para el caso de que quisiéramos renderizar el logo de la empresa en el cuerpo del mail.
    //     { 
    //         filename: 'logo.png',
    //         path: path.join(__dirname, 'logo.png'),
    //         contentType: 'application/image'
    //     }
    // ]
}

const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        console.log('¡Email enviado con éxito!')
    } catch (error) {
        console.error(error)

    }
}

sendMail(transporter, mailOptions)

module.exports = sendMail;

//! VIDEO: minuto 8:00
//* NOTA:
// Al hacer el checkout en la pasarela de pagos, se obtiene un objeto "data" como respuesta. Este objeto almacena:
//  data.order= {id: '2342234', type: 'mercadopago'}
//?  data.description = string con el nombre del producto.
//?  data.currency_id = string con las siglas de la moneda.
//  data.payer = {first_name:'', last_name:'', email:'', id:'122342'}
//  data.payment_method_id: string con el método de pago. Ej: 'master'
//  data.payment_type_id: string con el tipo de pago. Ej: 'credit_card'
//?  data.transaction_amount: valor numérico total de la compra.
//?  data.status: string que indica el estado de la compra. Ej: 'approved'.
//?  data.status_detail: string que indica el detalle del status de la compra. Ej: 'accredited' -->Con esta opción se podría determinar si se ejecuta: successmail o rejectedMail