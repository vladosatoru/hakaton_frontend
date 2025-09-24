import Image from 'next/image';
import Card from '@/components/ui/Card';

const News = () => {
  const news = [
    {
      title: 'Запуск новой системы мониторинга',
      excerpt: 'В Смоленской области внедрена современная система мониторинга дорожного движения',
      date: '15 декабря 2024',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Обновление дорожной инфраструктуры',
      excerpt: 'Завершены работы по модернизации ключевых транспортных узлов региона',
      date: '10 декабря 2024',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Цифровизация процессов',
      excerpt: 'Переход на электронный документооборот повысил эффективность работы',
      date: '5 декабря 2024',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="news" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Новости
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Последние события и достижения ЦОДД Смоленской области
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <Card key={index} hover>
              <div className="relative h-48 mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="text-sm text-text-muted mb-2">{item.date}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-text-muted">{item.excerpt}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;