import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf0 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden; 
`;

const BookWrapper = styled.div`
  width: 100%;
  max-width: 1000px; 
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
`;

const PageContent = styled.div`
  background: white;
  padding: 2rem;
  height: 100%;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
  font-family: 'Georgia', serif;
  line-height: 1.6;
  color: #2c3e50;
  overflow-y: auto;
  box-sizing: border-box;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  color: #1E3A5F;
  margin-bottom: 1rem;
  border-bottom: 2px solid #A7D7C5;
  padding-bottom: 0.5rem;
`;

const CoverPage = styled(PageContent)`
  background: linear-gradient(135deg, #2C6E63, #1E3A5F);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
`;

const NavigationControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  background: #FF7F6F;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: 0.2s;

  &:hover {
    background: #e56758;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const bookContent = [
  {
    title: 'Обложка',
    content: 'cover'
  },
  {
    title: 'Введение',
    content: `🌱 Добро пожаловать в книгу, которая станет твоим личным коучем на пути к здоровью. 
    Здесь нет строгих правил — только мягкие рекомендации, научные факты и вдохновляющие истории. 
    Читай по странице в день и постепенно внедряй новые привычки. Помни: маленькие шаги ведут к большим переменам.`
  },
  {
    title: 'Глава 1. Питание: основы',
    content: `🥗 Баланс макронутриентов. Наш организм нуждается в белках, жирах и углеводах. 
    Белки (мясо, рыба, бобовые) — строительный материал для мышц. Жиры (орехи, авокадо, масла) — 
    для гормонов и усвоения витаминов. Углеводы (крупы, овощи, фрукты) — главный источник энергии. 
    
    🥤 Вода. Пей не менее 1.5–2 литров чистой воды в день. Вода ускоряет метаболизм, очищает кожу 
    и помогает контролировать аппетит. Начинай утро со стакана тёплой воды с лимоном.`
  },
  {
    title: 'Глава 1. Питание: режим',
    content: `⏰ Режим питания. Старайся есть в одно и то же время — это синхронизирует работу ЖКТ. 
    Завтрак должен быть сытным (каши, яйца), обед — сбалансированным, ужин — лёгким (овощи, рыба). 
    Перекусы: орехи, фрукты, йогурт без сахара. Избегай еды за 3 часа до сна.
    
    📉 Контроль порций. Используй «правило тарелки»: половину заполняй овощами, четверть — белком, 
    четверть — сложными углеводами. Так ты автоматически будешь получать достаточно клетчатки.`
  },
  {
    title: 'Глава 2. Физическая активность',
    content: `🏃‍♂️ Почему важно двигаться. Регулярные тренировки снижают риск сердечно-сосудистых заболеваний, 
    укрепляют кости, улучшают настроение (вырабатываются эндорфины) и помогают держать вес. 
    Достаточно 150 минут умеренной активности в неделю (быстрая ходьба, плавание, велосипед).
    
    🧘 **Виды нагрузок.** Комбинируй кардио (бег, ходьба) с силовыми (приседания, отжимания) 
    и растяжкой (йога, пилатес). Это развивает выносливость, силу и гибкость одновременно.`
  },
  {
    title: 'Глава 2. Как начать бегать',
    content: `👟 Программа Couch to 5K. Если ты никогда не бегал, начни с интервалов: 
    1 минута бега / 2 минуты ходьбы, повторять 8 раз. Постепенно увеличивай время бега. 
    Через 9 недель ты сможешь без остановки пробежать 5 км.
    
    🎵 Музыка для бега. Создай плейлист с быстрыми треками (140–160 bpm) — это помогает держать ритм. 
    Или слушай аудиокниги — отвлекает от усталости.`
  },
  {
    title: 'Глава 3. Сон',
    content: `😴 Ценность сна. Во сне организм восстанавливается, мозг обрабатывает информацию, 
    укрепляется иммунитет. Хронический недосып ведёт к ожирению, диабету и депрессии. 
    Норма для взрослого — 7–9 часов.
    
    🌙 Гигиена сна. Ложись до полуночи, за час до сна убери гаджеты (синий свет мешает мелатонину). 
    Проветривай комнату, спи в полной темноте и прохладе (18–20°C).`
  },
  {
    title: 'Глава 3. Сон: лайфхаки',
    content: `☕ Кофеин. Не пей кофе после 14:00 — он может ухудшить качество сна даже если ты заснёшь.
    🍌 Лёгкий перекус. Банан, вишня, тёплое молоко с мёдом способствуют выработке мелатонина.
    🧘 Ритуалы. Тёплая ванна, чтение бумажной книги, дыхательные практики помогают настроиться на сон.`
  },
  {
    title: 'Глава 4. Ментальное здоровье',
    content: `🧠 Стресс и его последствия. Хронический стресс повышает кортизол, что ведёт к набору веса, 
    снижению иммунитета и выгоранию. Важно научиться расслабляться.
    
    🧘‍♀️ Медитация. Всего 10 минут в день снижают тревожность и улучшают концентрацию. 
    Попробуй приложения (Headspace, Calm) или просто сядь в тишине и наблюдай за дыханием.`
  },
  {
    title: 'Глава 4. Управление эмоциями',
    content: `📔 Дневник благодарности. Каждый вечер записывай три вещи, за которые ты благодарен. 
    Это тренирует мозг замечать позитив.
    
    🗣️ Общение. Не замыкайся в себе. Делиться переживаниями с близкими или психологом — 
    признак силы, а не слабости. Поддержка окружающих снижает уровень стресса.`
  },
  {
    title: 'Глава 5. Вредные привычки',
    content: `🚬 Курение. Отказ от сигарет улучшает работу лёгких уже через месяц, 
    а через год риск инфаркта снижается вдвое. Используй никотинозамещающую терапию, 
    если трудно бросить резко.
    
    🍷 Алкоголь. Безопасной дозы не существует. Алкоголь калориен, нарушает сон, 
    обезвоживает. Постарайся сократить до минимума или заменить на безалкогольные коктейли.`
  },
  {
    title: 'Глава 5. Цифровой детокс',
    content: `📱 Зависимость от телефона. Среднестатистический человек проверяет телефон 150 раз в день. 
    Это рассеивает внимание и повышает тревожность. Попробуй:
    - Убирать телефон за час до сна.
    - Отключать уведомления в соцсетях.
    - Выделять дни без гаджетов (хотя бы воскресенье).`
  },
  {
    title: 'Глава 6. Мотивация и цели',
    content: `🎯 SMART-цели. Цель должна быть конкретной, измеримой, достижимой, релевантной и ограниченной во времени. 
    Вместо «хочу похудеть» — «сбросить 3 кг за 2 месяца, занимаясь 3 раза в неделю».
    
    🔥 Отслеживание прогресса. Веди дневник, отмечай даже маленькие победы. 
    Визуализация (фото, графики) помогает не сдаваться.`
  },
  {
    title: 'Глава 6. Как не срываться',
    content: `💪 Правило 80/20. Позволяй себе иногда отдохнуть от строгих правил: 80% времени — здоровое питание, 
    20% — любимые вкусняшки. Так ты избежишь чувства вины и срывов.
    
    🤝 Поддержка. Найди единомышленников (друзья, онлайн-сообщества). Вместе легче соблюдать режим 
    и веселее отмечать успехи.`
  },
  {
    title: 'Заключение',
    content: `🌟 Ты пролистал всю книгу! Это значит, ты готов заботиться о себе. 
    Помни: здоровье — это марафон, а не спринт. Не требуй от себя мгновенных изменений, 
    давай себе время. Каждый твой маленький шаг уже приближает тебя к лучшей версии себя.
    
    📖 Возвращайся к этим страницам, когда нужна поддержка или вдохновение. 
    Будь здоров и счастлив!`
  }
];

const MotivationBook = () => {
  const bookRef = useRef();

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <BookContainer>
      <BookWrapper>
        <HTMLFlipBook
          ref={bookRef}
          width={400}           
          height={500}
          size="stretch"       
          minWidth={300}
          maxWidth={800}       
          minHeight={400}
          maxHeight={700}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="motivation-book"
          flippingTime={500}
          usePortrait={false}   
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          style={{ margin: '0 auto' }}
        >
          {bookContent.map((page, index) => {
            if (index === 0) {
              return (
                <div key={index} className="page">
                  <CoverPage>
                    <h1>📚 Стимул быть здоровым</h1>
                    <p>Путеводитель к лучшей версии себя</p>
                    <p style={{ marginTop: '2rem', fontSize: '1rem' }}>
                      {bookContent.length - 1} страниц мудрости
                    </p>
                  </CoverPage>
                </div>
              );
            }
            return (
              <div key={index} className="page">
                <PageContent>
                  <PageTitle>{page.title}</PageTitle>
                  <p style={{ whiteSpace: 'pre-line' }}>{page.content}</p>
                </PageContent>
              </div>
            );
          })}
        </HTMLFlipBook>
      </BookWrapper>
      <NavigationControls>
        <NavButton onClick={prevPage}><FaChevronLeft /> Назад</NavButton>
        <NavButton onClick={nextPage}>Вперёд <FaChevronRight /></NavButton>
      </NavigationControls>
    </BookContainer>
  );
};

export default MotivationBook;