import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Museum3D from './pages/3D/Museum3D';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Gallery from './pages/Gallery';
import UserDash from './pages/UserDash';
import Artwork from './pages/Artwork';
import UserFavoriteArtworksPage from './pages/UserFavoriteArtworksPage';
import UserPurchaseHistoryPage from './pages/PurchaseHistoryPage';
import ArtistEvents from './pages/ArtistEvents';
import EventDetails from './pages/EventDetails';
import ArtistDash from './pages/ArtistDash';
import ArtistArtworks from './pages/ArtistArtworks';
import CreateArtwork from './pages/CreateArtwork';
import CreateEvent from './pages/CreateEvent';
import Portfolio from './pages/Portfolio';
import AdminDash from './pages/AdminDash';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminArtistsPage from './pages/AdminArtistsPage';
import AdminEvents from './pages/AdminEvents';
import AdminStats from './pages/AdminStats';
import AllEvents from './pages/AllEvents';
import TicketReservation from './pages/TicketReservation';
import ArtistPortfolioEditor from './pages/ArtistPortfolioEditor';
import EditPortfolio from './pages/EditPortfolio';
import PaymentSuccess from './pages/PaymentSuccess';
import UserReservationsPage from './pages/UserReservationsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* done */}
      <Route path="/museum/:roomId" element={<Museum3D />} />
      <Route path='/register' element={<Register />} /> {/* à revoir */}
      <Route path='/login' element={<Login />} /> {/* à revoir */}
      <Route path='/about' element={<About />} /> {/* done */}
      <Route path='/gallery' element={<Gallery />} /> {/* done */}

      <Route path='/user-dash' element={<UserDash />} /> {/* done */}
      <Route path='/user/artworks/saved' element={<UserFavoriteArtworksPage />} /> {/* done */}
      <Route path='/user/artworks/purchased' element={<UserPurchaseHistoryPage />} /> {/* done */}

      <Route path='/artworks/:id' element={<Artwork />} /> {/* done */}
      <Route path='/artworks/create' element={<CreateArtwork />} /> {/* done */}
      <Route path='/artworks/edit/:id' element={<CreateArtwork />} /> {/* done */}

      <Route path='/events/:id' element={<EventDetails />} /> {/* done */}
      <Route path='/events/create' element={<CreateEvent />} /> {/* done */}
      <Route path='/events/:id/edit' element={<CreateEvent />} /> {/* done */}
      <Route path='/events' element={<AllEvents />} /> {/* done */}

      <Route path='/artist-dash' element={<ArtistDash />} /> {/* à revoir section events */}
      <Route path='/artist/artworks' element={<ArtistArtworks />} /> {/* done */}
      <Route path='/artist/events' element={<ArtistEvents />} /> {/* done */}
      <Route path='/artist/:id/portfolio' element={<Portfolio />} /> {/* done */}
      <Route path='/artist/portfolio/editor' element={<ArtistPortfolioEditor />} /> {/* done */}
      <Route path='/artist/portfolio/create' element={<ArtistPortfolioEditor />} /> {/* done */}
      <Route path="/artist/portfolio/edit" element={<EditPortfolio />} />

      <Route path='/admin-dash' element={<AdminDash />} />
      <Route path='/admin/users' element={<AdminUsersPage />} />
      <Route path='/admin/artists' element={<AdminArtistsPage />} />
      <Route path='/admin/events' element={<AdminEvents />} />
      <Route path='/admin/stats' element={<AdminStats />} />

      <Route path='/tickets/:id/reserve' element={<TicketReservation />} />
      <Route path='/payment-success' element={<PaymentSuccess />} />
      <Route path='/user/reservations' element={<UserReservationsPage />} />

    </Routes>
  );
}

export default App;