import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Store,
  User,
  CreditCard,
  CheckCircle,
  IndianRupee,
  Smartphone,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const PaymentPage = () => {

  const { orderId } =
    useParams();


  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadPayment =
      async () => {

        try {

          const response =
            await axios.get(
              `${API_URL}/api/orders/public/${orderId}`
            );


          setOrder(
            response.data.order
          );

        } catch (err) {

          console.error(err);

          setError(
            err.response?.data?.message ||
            "Payment page could not be loaded."
          );

        } finally {

          setLoading(false);

        }

      };


    loadPayment();

  }, [orderId]);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <p className="text-gray-600">
            Loading payment details...
          </p>

        </div>

      </div>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error || !order) {

    return (

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full">

          <CreditCard
            size={50}
            className="mx-auto text-red-500 mb-4"
          />

          <h1 className="text-xl font-bold text-gray-900">

            Payment Unavailable

          </h1>

          <p className="text-gray-500 mt-2">

            {error}

          </p>

        </div>

      </div>

    );

  }


  const shopName =
    order.tailor?.shopName ||
    order.tailor?.name ||
    "Tailor Shop";


  const amount =
    Number(order.amount || 0);


  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-[#5B2C18] to-[#8B451F] px-6 py-7 text-white">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">

              <Store size={24} />

            </div>

            <div>

              <h1 className="text-xl font-bold">

                {shopName}

              </h1>

              <p className="text-sm text-white/70">

                Order Payment

              </p>

            </div>

          </div>

        </div>


        <div className="p-6">

          {/* CUSTOMER */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">

              <User
                size={20}
                className="text-[#5B2C18]"
              />

            </div>

            <div>

              <p className="text-xs text-gray-400">
                Customer
              </p>

              <p className="font-semibold text-gray-900">

                {order.customer?.name}

              </p>

            </div>

          </div>


          {/* AMOUNT */}

          <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center">

            <p className="text-sm text-gray-500">

              Amount to Pay

            </p>

            <div className="flex items-center justify-center gap-1 mt-2">

              <IndianRupee
                size={25}
                strokeWidth={2.5}
              />

              <span className="text-4xl font-bold text-gray-900">

                {amount.toLocaleString(
                  "en-IN"
                )}

              </span>

            </div>

          </div>


          {/* QR */}

          {order.tailor?.paymentQr ? (

            <div className="mt-7 text-center">

              <div className="flex items-center justify-center gap-2">

                <Smartphone
                  size={20}
                  className="text-[#5B2C18]"
                />

                <h2 className="font-bold text-lg">

                  Scan & Pay

                </h2>

              </div>


              <p className="text-sm text-gray-500 mt-1">

                Scan using any UPI app

              </p>


              <div className="mt-5 flex justify-center">

                <div className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">

                  <img
                    src={
                      order.tailor.paymentQr
                    }
                    alt="UPI Payment QR"
                    className="w-60 h-60 object-contain"
                  />

                </div>

              </div>

            </div>

          ) : (

            <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">

              <p className="text-sm text-yellow-700 text-center">

                Payment QR has not been
                configured by this tailor.

              </p>

            </div>

          )}


          {/* UPI */}

          {order.tailor?.upiId && (

            <div className="mt-5 text-center">

              <p className="text-xs text-gray-400">

                UPI ID

              </p>

              <p className="font-semibold text-gray-800">

                {order.tailor.upiId}

              </p>

            </div>

          )}


          {/* READY STATUS */}

          {order.status === "ready" && (

            <div className="mt-6 flex gap-3 p-4 rounded-xl bg-green-50 border border-green-200">

              <CheckCircle
                size={22}
                className="text-green-600 shrink-0"
              />

              <div>

                <p className="font-semibold text-green-700">

                  Your order is ready!

                </p>

                <p className="text-xs text-green-600 mt-1">

                  Please collect your order
                  from the tailor.

                </p>

              </div>

            </div>

          )}


          {/* ORDER ID */}

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">

            <p className="text-xs text-gray-400">

              Order ID

            </p>

            <p className="text-sm font-medium text-gray-700 mt-1">

              {order.customer?.customerId}

            </p>

          </div>


          <p className="text-center text-xs text-gray-400 mt-6">

            Thank you for choosing{" "}

            {shopName} ❤️

          </p>

        </div>

      </div>

    </div>

  );

};

export default PaymentPage;