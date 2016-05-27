import React from 'react';

export default function PlayersCarousel(props) {
  const items = React.Children.map(props.children, (c) => <div className="c-carousel-item">{c}</div>);
  return (
    <div className="c-players-carousel">{items}</div>
  );
}
