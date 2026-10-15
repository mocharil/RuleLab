"""Fictional additional perspectives for larger synthetic discussion networks."""
NAMES = ['Aditya','Belinda','Cahyo','Dahlia','Erlangga','Fanny','Galih','Hanum']
DOMAIN_ROLES = {
 'digital_service':[
  ('Privacy auditor','clarity','Restricted data access and an auditable processing trail.'),
  ('Accessibility developer','accessibility','Keyboard, screen reader and simple interface testing.'),
  ('Regional network technician','capacity','Services keep running when the connection drops.'),
  ('Administrative helper for residents','access','Face-to-face help is available without device requirements.'),
  ('Tech start-up owner','cost','Integration and system change costs are proportionate.'),
  ('Information security researcher','clarity','Incident handling and system responsibilities are clear.'),
  ('Digital archive manager','capacity','Document retention and traceability are workable.'),
  ('Service complaints officer','access','Complaints across channels are recorded and followed up.')],
 'labor':[
  ('Freelance platform worker','access','Rights of workers in non-standard employment are considered.'),
  ('Factory HR manager','capacity','The labour policy transition is workable.'),
  ('Vocational trainer','access','Skills training is affordable.'),
  ('Woman worker','accessibility','Equal protection and job opportunities.'),
  ('Workplace safety inspector','clarity','Safety and supervision responsibilities are clear.'),
  ('Micro-business owner','cost','Compliance costs are realistic for small businesses.'),
  ('Industrial relations analyst','clarity','Dispute settlement has a procedure.'),
  ('Worker nearing retirement','access','Rights and social security continue without interruption during the transition.')],
 'maritime':[
  ('Woman fisher and fish processor','access','Catch processing gets access to support.'),
  ('Small port manager','capacity','Realistic landing and recording facilities.'),
  ('Coastal ecosystem researcher','other','Impact on habitats and seasons is reviewed.'),
  ('Seafood trader','cost','Supply chain and distribution costs are accounted for.'),
  ('Fishing gear inspector','clarity','Gear limits and supervision are easy to understand.'),
  ('Coastal tourism manager','other','Coastal use considers shared interests.'),
  ('Fishers cooperative facilitator','access','Financing and permits are accessible to small members.'),
  ('Vessel safety technician','capacity','Safety standards match fishers’ equipment.')],
 'environment':[
  ('Waste bank manager','capacity','Collection and sorting have the necessary facilities.'),
  ('Upstream farmer','access','Land-use changes do not ignore livelihoods.'),
  ('Air quality researcher','clarity','Monitoring indicators and data publication are defined.'),
  ('Informal recycling worker','accessibility','Informal workers are involved in the transition.'),
  ('Small industry operator','cost','The cost of managing impact is workable.'),
  ('Conservation area manager','other','Habitat restoration has a plan.'),
  ('Water treatment technician','capacity','Technical standards match plant capacity.'),
  ('Flood-affected community','access','Prevention and response involve affected residents.')],
 'health':[
  ('Chronic-patient companion','access','Continuity of services and referrals is guaranteed.'),
  ('Community pharmacist','clarity','Medicine distribution and professional responsibilities are clear.'),
  ('Small clinic manager','cost','Compliance costs match facility capacity.'),
  ('Village health volunteer','capacity','Workload and training are considered.'),
  ('Public health researcher','other','Evaluation indicators are relevant and checkable.'),
  ('Patient with a disability','accessibility','Services and communication include accommodation.'),
  ('Health facility technician','capacity','Medical facilities meet implementation needs.'),
  ('Home-care nurse','access','Services stay available for residents who find it hard to travel.')],
 'governance':[
  ('Integrated service manager','capacity','Cross-agency procedures do not get more complicated.'),
  ('Budget transparency watchdog','cost','Implementation costs can be audited.'),
  ('Governance researcher','clarity','Responsibilities and indicators are clear.'),
  ('Companion for vulnerable residents','accessibility','Procedures accommodate different needs.'),
  ('Regional data manager','capacity','Recording facilities and data quality are considered.'),
  ('Small licensing applicant','access','Licensing requirements are proportionate.'),
  ('Public complaints watchdog','clarity','Complaints have deadlines and follow-up.'),
  ('Village community organizer','access','Consultation can be joined by residents in remote areas.')],
}
COMMON = [
 ('Alya','Women’s community','accessibility','Care needs and equal access are considered.'),
 ('Bagas','Elderly resident','access','Procedures can be used without advanced technology skills.'),
 ('Citra','Resident of a remote area','access','Service access does not depend on distance or connectivity.'),
 ('Damar','Public policy academic','clarity','Definitions, indicators and goals are traceable.'),
 ('Eka','Indigenous community representative','other','Local practices and the community’s living space are reviewed.'),
 ('Farhan','Young job seeker','access','Open opportunities and access to information.'),
 ('Gita','Disability rights advocate','accessibility','Reasonable accommodation is stated in operational terms.'),
 ('Haris','Regional budget implementer','cost','Funding sources and transition costs are accounted for.'),
 ('Intan','Legal aid companion','clarity','Rights to object and procedural certainty are available.'),
 ('Joko','Community cooperative manager','capacity','Local cooperation and member capacity are considered.'),
 ('Kirana','Local policy journalist','clarity','Information can be verified by the public.'),
 ('Lukman','Low-income service user','cost','Direct and indirect costs do not block access.'),
 ('Maya','Public facility manager','capacity','Implementation matches the available facilities and staff.'),
 ('Naufal','Infrastructure provider','capacity','Maintenance schedules and responsibilities are clear.'),
 ('Putri','Child protection advocate','accessibility','Impact on children and families is reviewed.'),
 ('Seno','Business association representative','cost','Compliance certainty and the regulatory transition are considered.'),
]

def expand(base, domain, count):
    result=[{**p,'cluster':p.get('issue','other'),'synthetic':True} for p in base]
    extras=DOMAIN_ROLES.get(domain,DOMAIN_ROLES['governance'])
    for i,(role,issue,goal) in enumerate(extras):
        result.append({'id':f'{domain}_specialist_{i+1}','name':NAMES[i],'role':role,'background':f'Fictional persona with a {role.lower()} perspective in the {domain} sector.','goal':goal,'issue':issue,'domain':domain,'cluster':issue,'synthetic':True})
    for i,(name,role,issue,goal) in enumerate(COMMON):
        result.append({'id':f'{domain}_public_{i+1}','name':name,'role':role,'background':f'Fictional persona reviewing the regulation from a {role.lower()} perspective.','goal':goal,'issue':issue,'domain':domain,'cluster':issue,'synthetic':True})
    return result[:count]
