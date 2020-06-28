class Deathmatch < ApplicationRecord
	has_many(:users);

	def self.generate
		if Deathmatch.where(:state => "active").size() == 0
			Deathmatch.create({ :state => "active",
								:begin => (DateTime.now() + 30.seconds) });
		else
			deathmatch = Deathmatch.find_by(:state => "active");
			if DateTime.now() > deathmatch.begin && deathmatch.users.size() <= 1
				deathmatch.update({ :state => "inactive" });
				Deathmatch.create({ :state => "active",
									:begin => (DateTime.now() + 30.seconds) });
			else
				nil;
			end
		end
	end

	def self.join(user)
		deathmatch = Deathmatch.last();
		if deathmatch.state == "active" && DateTime.now() < deathmatch.begin
			deathmatch.users<<(user);
		else
			nil;
		end
	end

	def self.challenge(user)
		deathmatch = Deathmatch.last();
		if deathmatch.users.find_by(:id => user.id) != nil &&
		   deathmatch.state == "active" &&
		   DateTime.now() > deathmatch.begin
			deathmatch.users.where.not(:id => user.id).all().shuffle().first();
		else
			nil;
		end
	end

	def self.remove(user)
		deathmatch = Deathmatch.last();
		deathmatch.users.delete(user);
		if deathmatch.users.size() == 1
			user = deathmatch.users.last();
			user.deathmatch += 1;
			user.save();
			deathmatch.update({ :state => "inactive" });
		end
	end

end
