"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, Copy, Eye } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

export default function PaymentsList() {
  const { user } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/payments", {
        headers: {
          Authorization: `Bearer ${await user.getToken()}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "failed":
        return "error";
      case "pending":
        return "pending";
      default:
        return "default";
    }
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary-100 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="space-y-4">
          <div className="text-secondary-400">
            <Eye className="h-12 w-12 mx-auto mb-4" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900">
              No payments yet
            </h3>
            <p className="text-secondary-600">
              Create your first payment request to get started
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment._id} className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-secondary-900 truncate">
                  {payment.memo}
                </h3>
                <Badge variant={getStatusVariant(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-secondary-600 space-x-4">
                <span className="font-semibold text-primary-600">
                  {payment.amount} sBTC
                </span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-secondary-500 font-mono truncate max-w-xs">
                  {payment.address}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(payment.address)}
                  className="flex-shrink-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
