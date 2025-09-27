"use client";

import { useEffect } from "react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-secondary py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-text-muted">Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-semibold text-primary">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user.name || "Пользователь"}
            </h1>
            <p className="text-text-muted">{user.email}</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-muted">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Имя</p>
              <p className="font-medium">{user.name || "Не указано"}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Телефон</p>
              <p className="font-medium">{user.phone || "Не указан"}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Роль</p>
              <p className="font-medium">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Дата регистрации</p>
              <p className="font-medium">
                {new Date(user.createdAt || "").toLocaleDateString("ru-RU")}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
